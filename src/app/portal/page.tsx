import Image from "next/image";
import { redirect } from "next/navigation";
import { createPortalClient } from "@/lib/supabase/portal-server";
import SignOutButton from "./SignOutButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Intern portal | Devatrix", robots: { index: false, follow: false } };

export default async function InternPortal() {
  const supabase = createPortalClient();
  if (!supabase) return <main className="min-h-screen bg-slate-50 p-8 text-slate-900"><p>Portal access is temporarily unavailable. Please try again later.</p></main>;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !user.email_confirmed_at) redirect("/portal/sign-in");

  const { data: access, error: accessError } = await supabase.from("intern_portal_access").select("application_id").eq("user_id", user.id).eq("is_active", true).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (accessError || !access) redirect("/portal/sign-in");
  const { data: application, error: applicationError } = await supabase.from("internship_applications").select("full_name, track, status").eq("id", access.application_id).maybeSingle();
  if (applicationError || !application) return <main className="min-h-screen bg-slate-50 p-8 text-slate-900"><p>We couldn’t load your internship information. Please contact the Devatrix team.</p></main>;

  return (
    <main className="min-h-screen bg-[#f3f6fa] text-slate-900">
      <header className="bg-[#061833] px-5 py-5 sm:px-8"><div className="mx-auto flex max-w-5xl items-center justify-between gap-4"><div className="flex items-center gap-3 text-white"><Image src="/logo-transparent.png" alt="" width={40} height={40} priority /><span className="text-lg font-bold tracking-tight">Devatrix <span className="font-medium text-slate-300">/ Intern portal</span></span></div><SignOutButton /></div></header>
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-[#061833] sm:text-4xl">Welcome, {application.full_name}</h1>
        <p className="mt-3 text-base text-slate-600">Your internship information, in one place.</p>
        <section aria-labelledby="application-heading" className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 id="application-heading" className="text-lg font-bold text-[#061833]">Your application</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2"><div><dt className="text-sm text-slate-600">Internship track</dt><dd className="mt-1 font-semibold text-slate-900">{application.track}</dd></div><div><dt className="text-sm text-slate-600">Status</dt><dd className="mt-1 font-semibold capitalize text-slate-900">{application.status.replaceAll("_", " ")}</dd></div></dl>
        </section>
      </div>
    </main>
  );
}
