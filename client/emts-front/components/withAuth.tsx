// components/withAuth.tsx

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/lib/auth";

export function withAuth<T>(WrappedComponent: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        router.push("/session-expired");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
}
