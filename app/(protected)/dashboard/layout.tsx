import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your dashboard overview and analytics."
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}