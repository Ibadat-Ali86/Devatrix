import Image from "next/image";
import Link from "next/link";
import SetPasswordForm from "./SetPasswordForm";

export const metadata = { title: "Set up learner access | Devatrix", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function SetPasswordPage() {
  const configured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY && process.env.SUPABASE_SECRET_KEY);
  return <main className="flex min-h-screen flex-col bg-[#f3f6fa] text-slate-900">
    <header className="bg-[#061833] px-5 py-4 sm:px-8">
      <Link href="/" className="mx-auto flex max-w-6xl items-center gap-3 text-white" aria-label="Devatrix home">
        <Image src="/logo-transparent.png" alt="" width={40} height={40} priority/>
        <span className="text-lg font-bold tracking-tight">Devatrix <span className="font-medium text-slate-300">/ Learner portal</span></span>
      </Link>
    </header>
    <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16"><SetPasswordForm configured={configured}/></div>
  </main>;
}
