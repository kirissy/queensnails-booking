import Image from "next/image";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-cream md:flex-row">
      <aside className="hidden shrink-0 flex-col border-r border-nude/60 bg-cream-dark/20 md:flex md:w-56">
        <div className="flex items-center gap-2 px-5 py-5">
          <Image src="/icon.png" alt="" width={512} height={512} className="h-7 w-7" />
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold text-charcoal">queensnails</span>
            <span className="font-sans text-xs text-charcoal/40">admin</span>
          </span>
        </div>
        <AdminNav variant="sidebar" />
        <div className="mt-auto px-5 py-5">
          <SignOutButton />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-nude/60 px-6 py-4 sm:px-8 md:hidden">
          <span className="flex items-center gap-2">
            <Image src="/icon.png" alt="" width={512} height={512} className="h-7 w-7" />
            <span className="font-serif text-xl font-semibold text-charcoal">
              queensnails <span className="text-charcoal/40">admin</span>
            </span>
          </span>
          <SignOutButton />
        </header>

        <AdminNav variant="mobile" />

        <main className="flex-1 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
