import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your account settings and preferences"
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}