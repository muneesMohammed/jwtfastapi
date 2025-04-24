"use client";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export default function SessionExpiredPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfbf7] px-4"> {/* cream background */}
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Red pulse icon to draw attention */}
        <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4 animate-pulse" />

        {/* Alert Box with a red border for urgency */}
        <Alert className="border border-red-400 bg-white shadow-md rounded-xl">
          <AlertTitle className="text-xl font-semibold text-red-700">
            Session Expired
          </AlertTitle>
          <AlertDescription className="text-neutral-600 mt-1">
            Your session has expired. Please log in again to continue accessing your account.
          </AlertDescription>
        </Alert>

        {/* Action Button remains black for contrast */}
        <Button
          onClick={() => router.push("/login")}
          className="w-full bg-neutral-800 hover:bg-neutral-900 text-white font-medium py-3 rounded-lg shadow"
        >
          Log In Again
        </Button>

        {/* Footer Help Text */}
        <p className="text-sm text-neutral-500">
          Need help?{" "}
          <a href="/support" className="text-red-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
