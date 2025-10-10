import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Créer le client Supabase avec le service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Récupérer les données de la requête
    const { code, userId } = await req.json();

    // Validation des données
    if (!code || !userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Code et userId sont requis",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Vérifier si le code existe et n'est pas utilisé
    const { data: codeData, error: fetchError } = await supabaseAdmin
      .from("access_codes")
      .select("*")
      .eq("code", code)
      .eq("is_used", false)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching code:", fetchError);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Erreur lors de la vérification du code",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!codeData) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Code invalide ou déjà utilisé",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Marquer le code comme utilisé
    const { error: updateError } = await supabaseAdmin
      .from("access_codes")
      .update({
        is_used: true,
        used_by: userId,
        used_at: new Date().toISOString(),
      })
      .eq("code", code);

    if (updateError) {
      console.error("Error updating code:", updateError);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Erreur lors de la mise à jour du code",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Code activé avec succès",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "Erreur interne",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
