import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/server";
import AdminSignInForm from "./SignInForm";

export const metadata: Metadata = { title: "Admin sign in | Devatrix", robots: { index: false, follow: false } };

export default async function AdminSignInPage() {
  if (await getAdminUser()) redirect("/admin");
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-slate-900 sm:grid sm:place-items-center">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#071a36] text-lg font-black text-amber-400">D</div>
          <div><p className="text-lg font-bold">Devatrix</p><p className="text-xs font-medium uppercase tracking-[.16em] text-slate-500">Admin workspace</p></div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Sign in to continue</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Use the confirmed Supabase Auth account on the admin allowlist.</p>
        <AdminSignInForm />
        <p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">Admin access is restricted to configured email addresses. There is no public sign-up.</p>
      </section>
    </main>
  );
}
