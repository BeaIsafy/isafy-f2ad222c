import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { event, payment } = body;

    console.log("Asaas webhook received:", event, payment?.id);

    if (!payment) {
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find subscription by asaas subscription id
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("asaas_subscription_id", payment.subscription)
      .single();

    const companyId = subscription?.company_id || payment.externalReference;

    if (!companyId) {
      console.error("No company found for payment:", payment.id);
      return new Response(JSON.stringify({ received: true, warning: "no company found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Map Asaas status to our status
    const statusMap: Record<string, string> = {
      CONFIRMED: "paid",
      RECEIVED: "paid",
      PENDING: "pending",
      OVERDUE: "overdue",
      REFUNDED: "refunded",
      REFUND_REQUESTED: "refunded",
      CHARGEBACK_REQUESTED: "chargeback",
      CHARGEBACK_DISPUTE: "chargeback",
      AWAITING_CHARGEBACK_REVERSAL: "chargeback",
      DUNNING_REQUESTED: "overdue",
      DUNNING_RECEIVED: "paid",
      RECEIVED_IN_CASH: "paid",
    };

    const invoiceStatus = statusMap[payment.status] || "pending";

    // Upsert invoice
    const { data: existingInvoice } = await supabase
      .from("invoices")
      .select("id")
      .eq("asaas_payment_id", payment.id)
      .single();

    const invoiceData = {
      company_id: companyId,
      subscription_id: subscription?.id || null,
      asaas_payment_id: payment.id,
      asaas_invoice_url: payment.invoiceUrl || payment.bankSlipUrl || null,
      amount: payment.value,
      status: invoiceStatus,
      due_date: payment.dueDate,
      paid_at: invoiceStatus === "paid" ? new Date().toISOString() : null,
      description: payment.description || `Fatura ISAFY`,
    };

    if (existingInvoice) {
      await supabase.from("invoices").update(invoiceData).eq("id", existingInvoice.id);
    } else {
      await supabase.from("invoices").insert(invoiceData);
    }

    // Handle specific events
    switch (event) {
      case "PAYMENT_CONFIRMED":
      case "PAYMENT_RECEIVED": {
        // Activate company
        if (subscription) {
          await supabase
            .from("subscriptions")
            .update({ status: "active" })
            .eq("id", subscription.id);
        }
        await supabase
          .from("companies")
          .update({ is_active: true, blocked_at: null })
          .eq("id", companyId);
        break;
      }

      case "PAYMENT_OVERDUE": {
        // Check if overdue > 3 days
        const dueDate = new Date(payment.dueDate);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff >= 3) {
          await supabase
            .from("companies")
            .update({ blocked_at: new Date().toISOString() })
            .eq("id", companyId);

          if (subscription) {
            await supabase
              .from("subscriptions")
              .update({ status: "overdue" })
              .eq("id", subscription.id);
          }
        }
        break;
      }

      case "PAYMENT_DELETED":
      case "PAYMENT_REFUNDED": {
        if (subscription) {
          await supabase
            .from("subscriptions")
            .update({ status: "cancelled" })
            .eq("id", subscription.id);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("asaas-webhook error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ received: true, error: msg }), {
      status: 200, // Always return 200 to Asaas to avoid retries
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
