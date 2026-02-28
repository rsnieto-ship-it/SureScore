import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "Admin | SureScore",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen bg-white">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
