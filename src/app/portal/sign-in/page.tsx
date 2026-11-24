import { ProSignInAnimation } from "@/components/ui/pro-sign-in-animation";

export const metadata = {
  title: "Learner Portal Sign In | Devatrix Technologies",
  description: "Sign in to the Devatrix Learner Portal for verified fellows and accepted internees.",
  robots: { index: false, follow: false },
};

export default function PortalSignInPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      <ProSignInAnimation onSuccessRedirect="/portal" />
    </main>
  );
}
