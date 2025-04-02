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

export default function Page() {
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
        <div className="flex flex-1 flex-col gap-4 px-4 py-10">
          <div className="bg-muted/50 mx-auto h-24 w-full max-w-3xl rounded-xl" />
          <div className="bg-muted/50 mx-auto h-full w-full max-w-3xl rounded-xl" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


















// // app/dashboard/page.tsx
// import ProtectedRoute from '@/components/ProtectedRoute';
// import { Button } from '@/components/ui/button';
// import { logout } from '@/lib/auth';
// import { useRouter } from 'next/navigation';

// export default function DashboardPage() {
//   const router = useRouter();

//   const handleLogout = () => {
//     logout();
//     router.push('/login');
//   };

//   return (
//     <ProtectedRoute>
//       <div className="p-8">
//         <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
//         <p className="mb-4">Welcome to your dashboard!</p>
//         <Button onClick={handleLogout}>Logout</Button>
//       </div>
//     </ProtectedRoute>
//   );
// }