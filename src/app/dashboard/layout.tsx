import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // ログインしていなければログイン画面に戻す
  if (!user) {
    redirect("/login");
  }
  return (
    <div>
      <Sidebar />
      <main className="ml-64 flex-1 p-6">{children}</main>
    </div>
  );
}
