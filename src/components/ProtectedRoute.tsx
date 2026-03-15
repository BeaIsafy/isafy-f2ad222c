import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile, company } = useAuth();
  const [subCheck, setSubCheck] = useState<"loading" | "ok" | "trial_expired" | "overdue">("loading");

  useEffect(() => {
    if (!profile?.company_id) {
      setSubCheck("ok"); // No company yet (still onboarding)
      return;
    }

    const checkSubscription = async () => {
      // Check if company is blocked
      if (company?.blocked_at) {
        setSubCheck("overdue");
        return;
      }

      // Check subscription
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("company_id", profile.company_id)
        .single();

      if (!sub) {
        // No subscription - check if trial period (3 days from company creation)
        const createdAt = new Date(company?.created_at || profile.created_at || Date.now());
        const now = new Date();
        const daysSinceCreation = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceCreation >= 3) {
          setSubCheck("trial_expired");
        } else {
          setSubCheck("ok");
        }
        return;
      }

      if (sub.status === "overdue" || sub.status === "cancelled") {
        setSubCheck("overdue");
        return;
      }

      // active, trial, or pending (waiting for payment confirmation) are all OK
      if (sub.status === "active" || sub.status === "trial" || sub.status === "pending") {
        setSubCheck("ok");
        return;
      }

      setSubCheck("trial_expired");
    };

    checkSubscription();
  }, [profile, company]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user hasn't completed onboarding, redirect there
  if (profile && !profile.onboarding_completed && !window.location.pathname.startsWith("/onboarding")) {
    return <Navigate to="/onboarding" replace />;
  }

  // Allow payment page and onboarding
  const currentPath = window.location.pathname;
  const allowedPaths = ["/payment", "/onboarding"];
  const isAllowedPath = allowedPaths.some((p) => currentPath.startsWith(p));

  if (!isAllowedPath && subCheck === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAllowedPath && subCheck === "trial_expired") {
    return <Navigate to="/payment?reason=trial" replace />;
  }

  if (!isAllowedPath && subCheck === "overdue") {
    return <Navigate to="/payment?reason=overdue" replace />;
  }

  return <>{children}</>;
}
