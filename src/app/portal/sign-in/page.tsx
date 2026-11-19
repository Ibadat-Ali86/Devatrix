import Image from "next/image";
import Link from "next/link";
import SignInForm from "./SignInForm";

export const metadata = { title: "Intern sign in | Devatrix", robots: { index: false, follow: false } };

export default function PortalSignInPage() {
  return (
    <main className="dx-workspace flex min-h-screen flex-col bg-[#f3f6fa] text-slate-900">
      <header className="bg-[#061833] px-5 py-5 sm:px-8">
        <Link href="/" className="mx-auto flex max-w-6xl items-center gap-3 text-white">
          <Image src="/logo-transparent.png" alt="" width={40} height={40} priority />
          <span className="text-lg font-bold tracking-tight">Devatrix <span className="font-medium text-slate-300">/ Intern portal</span></span>
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-5 py-12 sm:py-20">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <h1 className="text-3xl font-bold tracking-tight text-[#061833]">Welcome back</h1>
          <p className="mb-8 mt-3 text-sm leading-6 text-slate-600">Sign in to view your internship information.</p>
          <SignInForm />
          <p className="mt-7 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-600">Need help accessing your account? <Link className="font-semibold text-amber-800 underline underline-offset-4" href="/contact">Contact our team</Link>.</p>
        </div>
      </div>
    </main>
  );
}
