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
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    const fetchUser = async () => {

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })
        const data = await res.json()
        setUser(data)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [])

  if (!user) {
    return null // or a loader
  }

  const role = user?.role?.name

  const navMain = [
    { title: "Search", url: "#", icon: Search , isActive: true},
    { title: "Ask AI", url: "#", icon: Sparkles },
    { title: "Home", url: "/foreman/dashboard", icon: Home },
    { title: "Daily Report", url: "/foreman/daily-report", icon: Flag },
    { title: "Reports", url: "/foreman/daily-report-list", icon: FileClock },
  ]

  if (role === "admin" || role === "manager") {
    navMain.push({
      title: "ProjectCreate",
      url: "/foreman/tasks/create",
      icon: ClipboardPlus,
    })
  }

  if (role === "admin") {
    navMain.push(
      {
        title: "Workers",
        url: "/foreman/workers",
        icon: Users,
      },
      {
        title: "Add User",
        url: "/admin/users",
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
        <NavFavorites favorites={favorites} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
      <NavUser
        user={{
          name: user.full_name,
          email: user.email,
          avatar: `/avatars/${user.full_name?.toLowerCase().replace(" ", "_")}.jpg`, // Optional: use default or actual
        }}
      />
    </Sidebar>
  )
}
