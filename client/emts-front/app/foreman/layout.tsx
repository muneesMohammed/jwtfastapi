// File: app/foreman/layout.tsx

import Link from "next/link";
import { cn } from "@/lib/utils";





// File: app/foreman/dashboard/page.tsx

import { TaskCard } from "@/components/TaskCard";
import ProtectedRoute from '@/components/ProtectedRoute'; 

import { AppSidebar } from "@/components/app-sidebar"
import { NavActions } from "@/components/nav-actions"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// const navItems = [
//   { name: "Dashboard", href: "/foreman/dashboard" },
//   { name: "Reports", href: "/foreman/reports" },
//   { name: "TasksCreate", href: "/foreman/tasks/create" },
//   { name: "Log Hours", href:"/foreman/log-hours" },
//     { name: "Workers", href: "/foreman/workers" },
//     { name: "Settings", href: "/foreman/settings" },
//     { name: "Logout", href: "/logout" },
// ];

export default function ForemanLayout({ children }: { children: React.ReactNode }) {
  return (
     <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            
      <header className="flex h-14 shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                  Project Management & Task Tracking
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-3">
          <NavActions />
        </div>
      </header>
      {/* Main Content */}
      <ProtectedRoute>
<main className="flex-1 p-6">{children}</main>
</ProtectedRoute>
        </SidebarInset>


        
  </SidebarProvider>
   
  );
}





