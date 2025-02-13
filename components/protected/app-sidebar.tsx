"use client";

import * as React from "react";
import { NavMain } from "@/components/protected/nav-main";
import { NavUser } from "@/components/protected/nav-user";
import { TeamSwitcher } from "@/components/protected/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { navigation } from "./data/navigation";

export function AppSidebar({ ...props }: React.ComponentPropsWithoutRef<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
