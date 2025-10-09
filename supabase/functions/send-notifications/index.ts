import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PushSubscription {
  user_id: string;
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

const PRIVATE_VAPID_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "";
const VAPID_SUBJECT = "mailto:contact@agp-wellness.com";

async function sendPushNotification(
  subscription: PushSubscription["subscription"],
  payload: { title: string; body: string; tag: string; url?: string }
) {
  try {
    const response = await fetch(subscription.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "TTL": "3600",
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (error) {
    console.error("Error sending push notification:", error);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    let notificationType: string | null = null;
    let title = "";
    let body = "";
    let tag = "";
    let url = "/";

    if (currentHour === 7 && currentMinute === 0) {
      notificationType = "breakfast";
      title = "🌅 Petit déjeuner";
      body = "Pensez aux protéines et bons gras pour votre dopamine!";
      tag = "breakfast-reminder";
      url = "/tracking";
    } else if (currentHour === 12 && currentMinute === 0) {
      notificationType = "lunch";
      title = "🍽️ Déjeuner";
      body = "C'est le moment du repas principal!";
      tag = "lunch-reminder";
      url = "/tracking";
    } else if (currentHour === 16 && currentMinute === 0) {
      notificationType = "snack";
      title = "☕ Goûter";
      body = "Une collation équilibrée pour tenir jusqu'au soir.";
      tag = "snack-reminder";
      url = "/tracking";
    } else if (currentHour === 19 && currentMinute === 0) {
      notificationType = "dinner";
      title = "🌙 Dîner";
      body = "Privilégiez un dîner léger pour un bon sommeil.";
      tag = "dinner-reminder";
      url = "/tracking";
    } else if (currentHour === 21 && currentMinute === 0) {
      notificationType = "wellness";
      title = "✨ Suivi quotidien";
      body = "Prenez 2 minutes pour enregistrer votre bien-être du jour.";
      tag = "wellness-reminder";
      url = "/tracking";
    }

    if (!notificationType) {
      return new Response(
        JSON.stringify({ message: "No notifications to send at this time" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: profiles, error: profilesError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("notifications_enabled", true);

    if (profilesError) throw profilesError;

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No users with notifications enabled" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const userIds = profiles.map((p) => p.id);

    for (const userId of userIds) {
      await supabase.from("in_app_notifications").insert({
        user_id: userId,
        title,
        body,
        type: notificationType,
      });
    }

    const { data: subscriptions, error: subsError } = await supabase
      .from("push_subscriptions")
      .select("*")
      .in("user_id", userIds);

    if (subsError) throw subsError;

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active push subscriptions found" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const results = await Promise.allSettled(
      subscriptions.map((sub: PushSubscription) =>
        sendPushNotification(sub.subscription, { title, body, tag, url })
      )
    );

    const successCount = results.filter((r) => r.status === "fulfilled" && r.value).length;

    return new Response(
      JSON.stringify({
        message: "Notifications sent",
        type: notificationType,
        sent: successCount,
        total: subscriptions.length,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in send-notifications function:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
