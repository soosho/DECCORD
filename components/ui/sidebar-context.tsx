"use client"

import * as React from "react"

interface SidebarContextValue {
  isMobile: boolean
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue>({
  isMobile: false,
  isCollapsed: false,
  setIsCollapsed: () => null,
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const value = React.useMemo(
    () => ({
      isMobile,
      isCollapsed,
      setIsCollapsed,
    }),
    [isMobile, isCollapsed]
  )

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}