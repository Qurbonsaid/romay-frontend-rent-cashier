// src/components/AppSidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
// import { SidebarGroup as GroupType } from "@/types/sidebar"
// import { SidebarGroup as GroupType } from "@/types/sidebar"
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface SidebarItem {
  title: string
  icon: LucideIcon
  url: string
  isActive?: boolean
}

interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

interface AppSidebarProps {
  groups: SidebarGroup[]
  header?: React.ReactNode
  footer?: React.ReactNode
}

export function AppSidebar({ groups, header, footer }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>{header}</SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="data-[active=true]:bg-[#10B981] data-[active=true]:text-white"
                      isActive={item.isActive}
                      asChild
                    >
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>{footer}</SidebarFooter>
    </Sidebar>
  )
}
