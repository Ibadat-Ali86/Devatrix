import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/server";
import LearnerManagement from "./LearnerManagement";

export const dynamic = "force-dynamic";
export const metadata = { title: "Learner program | Devatrix admin", robots: { index: false, follow: false } };

export default async function LearnerProgramAdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/sign-in");
  return <LearnerManagement />;
}
