// File: app/foreman/dashboard/page.tsx

import { TaskCard } from "@/components/TaskCard";

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

export default function ForemanDashboard() {
  const tasks = [
    { id: "101", title: "Pour Concrete Slab", status: "In Progress", deadline: "2025-04-10" },
    { id: "102", title: "Install Rebar", status: "Not Started", deadline: "2025-04-12" }
  ];

  return (

      <div className="flex flex-1 flex-col gap-4 px-4 py-10">
      <h1 className="text-2xl font-bold">Foreman Dashboard</h1>
        <div className="bg-muted/50 mx-auto h-24 w-full max-w-3xl rounded-xl" />
        <div className="bg-muted/50 mx-auto h-full w-full max-w-3xl rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            status={task.status as any}
            deadline={task.deadline}
          />
        ))}
      </div>
      </div>


  );
}
