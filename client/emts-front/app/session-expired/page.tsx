// "use client";

// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// export default function SessionExpired() {
//   const router = useRouter();

//   const handleLoginRedirect = () => {
//     localStorage.removeItem("token");
//     router.push("/login");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen text-center">
//       <h1 className="text-3xl font-bold mb-4">Session Expired</h1>
//       <p className="text-gray-600 mb-6">
//         Your session has expired. Please log in again to continue.
//       </p>
//       <Button onClick={handleLoginRedirect}>Go to Login</Button>
//     </div>
//   );
// }


// app/session-expired/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SessionExpiredPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-6 px-4">
      <h1 className="text-3xl font-bold text-red-500">Session Expired</h1>
      <p className="text-gray-600">Your session has expired. Please log in again to continue.</p>
      <Button onClick={() => router.push("/login")}>Log In</Button>
    </div>
  );
}
