// components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";
import { getToken, isTokenExpired } from "@/lib/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      if (!token || isTokenExpired(token)) {
        // Optional: clear token
        localStorage.removeItem("token");

        // Redirect to session expired page
        router.push("/session-expired");
        setIsAuth(false);
      } else {
        setIsAuth(true);
      }
    };

    checkAuth();
  }, [router]);

  if (isAuth === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}
