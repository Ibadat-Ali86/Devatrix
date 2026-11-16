import { redirect } from "next/navigation";
import { getActiveLearner } from "@/lib/portal/server";
import PortalDashboard from "./PortalDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Learner portal | Devatrix", robots: { index: false, follow: false } };

export default async function InternPortal() {
  const { error } = await getActiveLearner();
  if (error === "unauthorized") redirect("/portal/sign-in");
  if (error) return <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center text-slate-700"><p>Portal access is temporarily unavailable. Please try again later.</p></main>;
  return <PortalDashboard />;
}
