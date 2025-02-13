import { LucideIcon } from "lucide-react"

export interface BreadcrumbItem {
  title: string
  href?: string
  icon?: LucideIcon
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
}