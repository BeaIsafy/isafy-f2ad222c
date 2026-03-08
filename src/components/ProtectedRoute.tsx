import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth();

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

  return <>{children}</>;
}
