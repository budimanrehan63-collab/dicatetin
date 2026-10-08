import { createAdminClient } from "@/lib/supabase/admin";

export type FeatureCode =
  | "telegram"
  | "ai_scan"
  | "ai_voice"
  | "ai_chat"
  | "ai_insight"
  | "export"
  | "budget";

/**
 * Checks if a user has access to a specific feature based on their assigned plan
 * Must always be verified on server actions, route handlers, and bot webhooks.
 */
export async function hasFeature(
  userId: string,
  featureCode: FeatureCode
): Promise<boolean> {
  try {
    const supabase = createAdminClient();

    // 1. Fetch user's profile and current plan
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("status, plan_id, role")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return false;
    }

    // Admins and Superadmins have all features
    if (profile.role === "admin" || profile.role === "superadmin") {
      return true;
    }

    // Must be active
    if (profile.status !== "active") {
      return false;
    }

    if (!profile.plan_id) {
      return false;
    }

    // 2. Check if featureCode is in plan_features for this plan
    const { data: feature, error: featureError } = await supabase
      .from("plan_features")
      .select("id")
      .eq("plan_id", profile.plan_id)
      .eq("feature_code", featureCode)
      .maybeSingle();

    if (featureError || !feature) {
      return false;
    }

    return true;
  } catch (err) {
    console.error("hasFeature error:", err);
    return false;
  }
}

/**
 * Check if user has exceeded their monthly AI quota
 */
export async function checkAIQuota(userId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
}> {
  try {
    const supabase = createAdminClient();

    // Get user plan & monthly quota
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan_id, plans(ai_quota_monthly)")
      .eq("id", userId)
      .single();

    const limit = (profile as any)?.plans?.ai_quota_monthly || 0;
    if (limit === 0) {
      return { allowed: false, used: 0, limit: 0 };
    }

    // Count this month's AI tasks
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from("ai_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", firstDayOfMonth.toISOString());

    const used = count || 0;
    return {
      allowed: used < limit,
      used,
      limit,
    };
  } catch (err) {
    console.error("checkAIQuota error:", err);
    return { allowed: true, used: 0, limit: 300 }; // Fallback permissive
  }
}
