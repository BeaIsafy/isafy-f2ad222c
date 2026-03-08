import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SyncPayload {
  property_id: string;
  action: "publish" | "update" | "unpublish";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // User client (respects RLS)
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getUser(token);
    if (claimsError || !claimsData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userId = claimsData.user.id;

    // Admin client (bypasses RLS for wp config read)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's company
    const { data: profile } = await userClient.from("profiles").select("company_id").eq("id", userId).single();
    if (!profile?.company_id) {
      return new Response(JSON.stringify({ error: "Company not found" }), { status: 400, headers: corsHeaders });
    }
    const companyId = profile.company_id;

    // Get WP config
    const { data: wpConfig } = await adminClient
      .from("wordpress_configs")
      .select("*")
      .eq("company_id", companyId)
      .eq("is_active", true)
      .single();

    if (!wpConfig) {
      return new Response(JSON.stringify({ error: "WordPress não configurado. Acesse Configurações > Integrações." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { property_id, action } = (await req.json()) as SyncPayload;

    // Get property
    const { data: property } = await userClient.from("properties").select("*").eq("id", property_id).single();
    if (!property) {
      return new Response(JSON.stringify({ error: "Property not found" }), { status: 404, headers: corsHeaders });
    }

    const wpUrl = wpConfig.wp_url.replace(/\/$/, "");
    const wpAuth = btoa(`${wpConfig.wp_user}:${wpConfig.wp_app_password}`);
    const wpHeaders = {
      Authorization: `Basic ${wpAuth}`,
      "Content-Type": "application/json",
    };

    // Build WP post body
    const buildPostBody = () => {
      const priceText = property.sale_price
        ? `R$ ${Number(property.sale_price).toLocaleString("pt-BR")}`
        : "";
      
      const features = [];
      if (property.bedrooms) features.push(`${property.bedrooms} quartos`);
      if (property.suites) features.push(`${property.suites} suítes`);
      if (property.bathrooms) features.push(`${property.bathrooms} banheiros`);
      if (property.parking_spaces) features.push(`${property.parking_spaces} vagas`);
      if (property.total_area) features.push(`${property.total_area}m²`);

      const content = `
<!-- wp:heading -->
<h2>${property.title}</h2>
<!-- /wp:heading -->

${priceText ? `<!-- wp:paragraph {"className":"property-price"} --><p class="property-price"><strong>${priceText}</strong></p><!-- /wp:paragraph -->` : ""}

${features.length > 0 ? `<!-- wp:paragraph {"className":"property-features"} --><p class="property-features">${features.join(" · ")}</p><!-- /wp:paragraph -->` : ""}

${property.description ? `<!-- wp:paragraph --><p>${property.description}</p><!-- /wp:paragraph -->` : ""}

${property.address || property.neighborhood || property.city ? `<!-- wp:paragraph {"className":"property-location"} --><p class="property-location">📍 ${[property.address, property.neighborhood, property.city, property.state].filter(Boolean).join(", ")}</p><!-- /wp:paragraph -->` : ""}

${property.code ? `<!-- wp:paragraph {"className":"property-code"} --><p class="property-code">Código: ${property.code}</p><!-- /wp:paragraph -->` : ""}
      `.trim();

      return {
        title: property.title,
        content,
        status: "publish",
        meta: {
          isafy_property_id: property.id,
          isafy_code: property.code || "",
          isafy_price: property.sale_price?.toString() || "",
          isafy_category: property.category || "",
          isafy_bedrooms: property.bedrooms?.toString() || "0",
          isafy_bathrooms: property.bathrooms?.toString() || "0",
          isafy_parking: property.parking_spaces?.toString() || "0",
          isafy_area: property.total_area?.toString() || "0",
          isafy_city: property.city || "",
          isafy_neighborhood: property.neighborhood || "",
          isafy_state: property.state || "",
        },
      };
    };

    let result: any;

    if (action === "publish") {
      // Create new WP post
      const body = buildPostBody();
      const wpRes = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
        method: "POST",
        headers: wpHeaders,
        body: JSON.stringify(body),
      });

      if (!wpRes.ok) {
        const errBody = await wpRes.text();
        console.error("WP create error:", wpRes.status, errBody);
        return new Response(JSON.stringify({ error: `WordPress error: ${wpRes.status}`, details: errBody }), {
          status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const wpPost = await wpRes.json();

      // Save wp_post_id and publish_website flag
      await adminClient.from("properties").update({
        wp_post_id: wpPost.id,
        publish_website: true,
      }).eq("id", property_id);

      result = { success: true, action: "published", wp_post_id: wpPost.id, wp_url: wpPost.link };

    } else if (action === "update") {
      if (!property.wp_post_id) {
        // No WP post yet, create instead
        const body = buildPostBody();
        const wpRes = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
          method: "POST",
          headers: wpHeaders,
          body: JSON.stringify(body),
        });

        if (!wpRes.ok) {
          const errBody = await wpRes.text();
          console.error("WP create error:", wpRes.status, errBody);
          return new Response(JSON.stringify({ error: `WordPress error: ${wpRes.status}` }), {
            status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const wpPost = await wpRes.json();
        await adminClient.from("properties").update({ wp_post_id: wpPost.id }).eq("id", property_id);
        result = { success: true, action: "published", wp_post_id: wpPost.id, wp_url: wpPost.link };
      } else {
        // Update existing WP post
        const body = buildPostBody();
        const wpRes = await fetch(`${wpUrl}/wp-json/wp/v2/posts/${property.wp_post_id}`, {
          method: "PUT",
          headers: wpHeaders,
          body: JSON.stringify(body),
        });

        if (!wpRes.ok) {
          const errBody = await wpRes.text();
          console.error("WP update error:", wpRes.status, errBody);
          return new Response(JSON.stringify({ error: `WordPress error: ${wpRes.status}` }), {
            status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const wpPost = await wpRes.json();
        result = { success: true, action: "updated", wp_post_id: wpPost.id, wp_url: wpPost.link };
      }

    } else if (action === "unpublish") {
      if (property.wp_post_id) {
        // Move to trash in WP
        const wpRes = await fetch(`${wpUrl}/wp-json/wp/v2/posts/${property.wp_post_id}`, {
          method: "DELETE",
          headers: wpHeaders,
        });

        if (!wpRes.ok) {
          const errBody = await wpRes.text();
          console.error("WP delete error:", wpRes.status, errBody);
        }
      }

      await adminClient.from("properties").update({
        wp_post_id: null,
        publish_website: false,
      }).eq("id", property_id);

      result = { success: true, action: "unpublished" };
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("sync-wordpress error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
