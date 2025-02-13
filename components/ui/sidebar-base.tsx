"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    collapsible?: "icon" | "full"
  }
>(({ className, collapsible, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "group/sidebar relative flex h-full w-[270px] flex-col gap-4 p-4 transition-[width] duration-300 ease-in-out",
      collapsible === "icon" &&
        "hover:w-[270px] data-[state=closed]:w-[70px] [&_[data-label]]:data-[state=closed]:hidden",
      collapsible === "full" && "data-[state=closed]:w-0",
      className
    )}
    {...props}
  />
))
Sidebar.displayName = "Sidebar"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
))
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 flex-col gap-4 overflow-hidden", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props} />
))
SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-3 text-xs font-medium text-muted-foreground", className)}
    {...props}
  />
))
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-auto", className)} {...props} />
))
SidebarFooter.displayName = "SidebarFooter"

export const SidebarRail = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute right-0 top-0 h-full w-px bg-border",
      className
    )}
    {...props}
  />
))
SidebarRail.displayName = "SidebarRail"