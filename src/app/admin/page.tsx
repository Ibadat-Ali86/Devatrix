import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/server";
import AdminConsole from "./AdminConsole";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin workspace | Devatrix", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/sign-in");
  return <AdminConsole email={user.email ?? "Admin"} />;
}
