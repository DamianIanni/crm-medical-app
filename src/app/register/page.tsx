import { Metadata } from "next";
import { RegisterForm } from "@/components/forms/registerForm";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your account",
};

export default function RegisterPage() {
  return (
    <PageAnimationWrapper>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <RegisterForm />
        </div>
      </div>
    </PageAnimationWrapper>
  );
}
