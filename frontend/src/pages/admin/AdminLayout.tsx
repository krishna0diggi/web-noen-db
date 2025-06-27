import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";


interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1">
          <div className="p-4 border-b border-border bg-card flex items-center justify-between">
            <SidebarTrigger />
            <ThemeToggle />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}