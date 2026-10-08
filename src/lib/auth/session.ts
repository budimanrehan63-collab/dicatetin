import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  phone_wa?: string;
  role: "superadmin" | "admin" | "user";
  status: "pending" | "active" | "suspended" | "expired";
  plan_id?: string;
  plan_name?: string;
  telegram_chat_id?: number;
  telegram_username?: string;
  default_wallet_id?: string;
  theme?: string;
  timezone?: string;
  onboarding_done: boolean;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*, plans(name)")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      // Return basic profile from user metadata if profile row isn't synced yet
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        role: "user",
        status: "active",
        onboarding_done: true,
      };
    }

    return {
      id: profile.id,
      email: user.email,
      full_name: profile.full_name,
      phone_wa: profile.phone_wa,
      role: profile.role,
      status: profile.status,
      plan_id: profile.plan_id,
      plan_name: profile.plans?.name || "Basic",
      telegram_chat_id: profile.telegram_chat_id,
      telegram_username: profile.telegram_username,
      default_wallet_id: profile.default_wallet_id,
      theme: profile.theme,
      timezone: profile.timezone,
      onboarding_done: profile.onboarding_done,
    };
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return null;
  }
}

export async function requireAdmin(): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    redirect("/login?error=unauthorized");
  }
  return user;
}
