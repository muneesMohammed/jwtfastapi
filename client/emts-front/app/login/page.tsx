'use client';
import dynamic from "next/dynamic";

const LoginForm = dynamic(() =>
  import("@/components/login-form").then((mod) => ({ default: mod.LoginForm })),
  { ssr: false }
);

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
