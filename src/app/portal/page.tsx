import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveLearner } from "@/lib/portal/server";
import PortalDashboard from "./PortalDashboard";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Learner Portal | Devatrix Technologies",
  description: "Devatrix Engineering Fellowship & Verified Learner Suite",
  robots: { index: false, follow: false },
};

export default async function InternPortal() {
  const { error } = await getActiveLearner();
  if (error === "unauthorized") redirect("/portal/sign-in");
  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FAF9F6] px-6 text-center text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
        <div className="max-w-md rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold">
            !
          </div>
          <h1 className="text-xl font-bold text-[#061833] mb-2">Portal Access Unavailable</h1>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Portal services are temporarily synchronizing or unavailable. Please refresh or contact your program coordinator.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-sm font-bold text-[#061833] transition-colors shadow-xs"
          >
            ← Return to Devatrix
          </Link>
        </div>
      </main>
    );
  }
  return <PortalDashboard />;
}
