// components/withAuth.tsx

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isTokenExpired } from "@/lib/auth"
import type { ComponentType, FC } from "react"

export function withAuth<T extends object>(WrappedComponent: ComponentType<T>): FC<T> {
  const AuthenticatedComponent: FC<T> = (props) => {
    const router = useRouter()

    useEffect(() => {
      const token = localStorage.getItem("token")
      if (!token || isTokenExpired(token)) {
        router.push("/session-expired")
      }
    }, [router])

    return <WrappedComponent {...props} />
  }

  return AuthenticatedComponent
}
