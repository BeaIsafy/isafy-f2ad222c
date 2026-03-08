import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ASAAS_API_URL = "https://api.asaas.com/v3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY");
    if (!ASAAS_API_KEY) throw new Error("ASAAS_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { planId, paymentMethod, companyName, email, cpfCnpj, phone } = await req.json();

    // 1. Get user's company
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id) throw new Error("User has no company");

    // 2. Check if subscription already exists
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("company_id", profile.company_id)
      .single();

    let asaasCustomerId = existingSub?.asaas_customer_id;

    // 3. Create or get Asaas customer
    if (!asaasCustomerId) {
      const customerRes = await fetch(`${ASAAS_API_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: ASAAS_API_KEY,
        },
        body: JSON.stringify({
          name: companyName,
          email: email,
          cpfCnpj: cpfCnpj,
          phone: phone,
          notificationDisabled: false,
        }),
      });

      const customerData = await customerRes.json();
      if (!customerRes.ok) {
        console.error("Asaas customer error:", customerData);
        throw new Error(`Failed to create Asaas customer: ${JSON.stringify(customerData)}`);
      }
      asaasCustomerId = customerData.id;
    }

    // 4. Plan pricing map
    const planPrices: Record<string, number> = {
      start: 207,
      performance: 335,
      pro: 557,
    };

    const price = planPrices[planId];
    if (!price) throw new Error("Invalid plan ID");

    // 5. Create Asaas subscription
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 3); // 3-day trial
    const dueDateStr = nextDueDate.toISOString().split("T")[0];

    const subscriptionRes = await fetch(`${ASAAS_API_URL}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: ASAAS_API_KEY,
      },
      body: JSON.stringify({
        customer: asaasCustomerId,
        billingType: paymentMethod === "PIX" ? "PIX" : "CREDIT_CARD",
        value: price,
        nextDueDate: dueDateStr,
        cycle: "MONTHLY",
        description: `ISAFY - Plano ${planId}`,
        externalReference: profile.company_id,
      }),
    });

    const subscriptionData = await subscriptionRes.json();
    if (!subscriptionRes.ok) {
      console.error("Asaas subscription error:", subscriptionData);
      throw new Error(`Failed to create Asaas subscription: ${JSON.stringify(subscriptionData)}`);
    }

    // 6. Upsert subscription in our DB
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 3);

    const subRecord = {
      company_id: profile.company_id,
      asaas_customer_id: asaasCustomerId,
      asaas_subscription_id: subscriptionData.id,
      plan_id: planId,
      status: "active",
      trial_ends_at: trialEndsAt.toISOString(),
      current_period_start: new Date().toISOString(),
      current_period_end: trialEndsAt.toISOString(),
      payment_method: paymentMethod,
    };

    if (existingSub) {
      await supabase
        .from("subscriptions")
        .update(subRecord)
        .eq("id", existingSub.id);
    } else {
      await supabase.from("subscriptions").insert(subRecord);
    }

    // 7. Update company plan
    await supabase
      .from("companies")
      .update({ plan_id: planId, is_active: true, blocked_at: null })
      .eq("id", profile.company_id);

    return new Response(
      JSON.stringify({
        success: true,
        subscriptionId: subscriptionData.id,
        customerId: asaasCustomerId,
        // If PIX, return the payment link from first invoice
        paymentLink: subscriptionData.paymentLink || null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("create-asaas-subscription error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
