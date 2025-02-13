"use client"

import * as React from "react"
import { CircuitBoard } from "lucide-react"
import { siteConfig } from "@/lib/config"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="pointer-events-none h-16"
        >
          <div className="flex aspect-square size-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-foreground/20">
            <CircuitBoard className="size-12 text-primary-foreground" />
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate text-lg font-semibold">
              {siteConfig.name}
            </span>
            <span className="inline-flex">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                PRO
              </span>
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
