"use client"

import * as React from "react"
import {
  Calendar,
  Home,
  Flag,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  ClipboardPlus,
  UserRoundPlus,
  FileClock,
  Users
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  interface User {
    full_name: string;
    email: string;
    role?: {
      name: string;
    };
  }

  const [user, setUser] = React.useState<User | null>(null)


  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
  
      const fetchUser = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
            credentials: "include",
          });
          const data = await res.json();
          setUser(data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
  
      fetchUser();
    }
  }, []);

  if (!user) {
    return null // or render a loading spinner
  }

  const role = user?.role?.name

  const navMain = [
    { title: "Search", url: "#", icon: Search, isActive: true },
    { title: "Ask AI", url: "#", icon: Sparkles },
    { title: "Home", url: "/v1/foreman/dashboard", icon: Home },

  ]

  if (role === "foreman") {
    navMain.push(
      { title: "Daily Report", url: "/v1/foreman/daily-report", icon: Flag },
      { title: "Reports", url: "/v1/foreman/daily-report-list", icon: FileClock }
    )
  }
  if (role === "admin" || role === "manager") {
    navMain.push({
      title: "ProjectCreate",
      url: "/v1/projects",
      icon: ClipboardPlus,
    })
  }

  if (role === "admin") {
    navMain.push(
      {
        title: "Add Employee",
        url: "/v1/employees",
        icon: Users,
      },
      {
        title: "Add User",
        url: "/v1/admin/users",
        icon: UserRoundPlus,
      }
    )
  }

  navMain.push({
    title: "Inbox",
    url: "#",
    icon: Inbox,
  })

  const navSecondary = [
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Settings", url: "#", icon: Settings2 },
    { title: "Help", url: "#", icon: MessageCircleQuestion },
  ]

  const favorites = [
    { name: "Masaar", url: "#", emoji: "📊" },
    { name: "Agri Hub by URB", url: "#", emoji: "🌱" },
    { name: "One Za'abeel", url: "#", emoji: "🏠" },
  ]

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={[]} />
        <NavMain items={navMain} />
      </SidebarHeader>
      <SidebarContent>
      {(role === "foreman") && <NavFavorites favorites={favorites} />}
        {/* <NavFavorites favorites={favorites} /> */}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
      <NavUser
        user={{
          name: user.full_name,
          email: user.email,
          avatar: `/avatars/${user.full_name?.toLowerCase().replace(" ", "_")}.jpg`,
        }}
      />
    </Sidebar>
  )
}