"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { ChevronsUpDown } from "lucide-react"
import { useTheme } from "next-themes"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavUser() {
  const { user } = useUser()
  const { theme } = useTheme()

  if (!user) return null

  const displayName = user.username || user.emailAddresses[0]?.emailAddress.split('@')[0] || 'User'
  const email = user.emailAddresses[0]?.emailAddress

  return (
    <div className="flex flex-col gap-2">
      <SidebarMenu>
        <SidebarMenuItem className="relative">
          <SidebarMenuButton
            size="lg"
            className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="rounded-lg">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{displayName}</span>
              <span className="truncate text-xs">{email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: {
                rootBox: "absolute inset-0 w-full h-full",
                userButtonTrigger: "w-full h-full opacity-0 cursor-pointer",
                userButtonPopoverCard: "shadow-lg border border-border",
                userButtonPopoverActions: "p-1",
                userButtonPopoverActionButtonText: theme === "dark" ? "text-white" : "text-black",
                userButtonPopoverActionButton: "hover:bg-accent hover:text-accent-foreground",
                userButtonPopoverFooter: "hidden"
              }
            }}
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}
