"use client"

import { Book, Library, Users, History, LogOut, UserIcon, ShieldCheck, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter, usePathname } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  const isAdmin = user?.role === "ADMIN"

  const navigationItems = [
    {
      title: "Tableau de bord",
      icon: Book,
      url: "/dashboard",
      show: true,
    },
    {
      title: "Catalogue",
      icon: Library,
      url: "/dashboard/catalogue",
      show: true,
    },
    {
      title: "Mes Emprunts",
      icon: History,
      url: "/dashboard/my-loans",
      show: !isAdmin,
    },
    {
      title: "Gestion Utilisateurs",
      icon: Users,
      url: "/dashboard/users",
      show: isAdmin,
    },
    {
      title: "Gestion Emprunts",
      icon: ShieldCheck,
      url: "/dashboard/loans",
      show: isAdmin,
    },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border/50 h-16 flex flex-row items-center justify-between px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Book className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-lg">BiblioApp</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Button variant="ghost" size="icon-lg" className="lg:hidden" onClick={() => setOpenMobile(false)}>
          <X className="size-4" />
          <span className="sr-only">Fermer le menu</span>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems
                .filter((item) => item.show)
                .map((item) => {
                  const isActive = item.url === "/dashboard" ? pathname === item.url : pathname.startsWith(item.url)
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        onClick={() => router.push(item.url)}
                        isActive={isActive}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="w-full h-11">
                  <Avatar className="size-9 rounded-lg">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.nom?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start gap-0.5 ml-2">
                    <span className="text-sm font-medium">{user?.nom}</span>
                    <span className="text-xs text-muted-foreground uppercase">{user?.role}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                  <UserIcon className="mr-2 size-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
