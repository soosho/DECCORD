'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { type BreadcrumbProps } from "@/types/breadcrumb"
import { ChevronRight, Home } from "lucide-react"

export function BreadcrumbNav({ items }: BreadcrumbProps) {
  // Create an array with home and all other items
  const allItems = [
    { title: "Home", href: "/dashboard", icon: Home },
    ...items
  ]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {allItems.map((item, index) => (
          <BreadcrumbItem key={item.href || `item-${index}`}>
            {index > 0 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
            {item.href ? (
              <BreadcrumbLink href={item.href} className="flex items-center">
                {item.icon && <item.icon className="h-4 w-4" />}
                <span className={item.icon ? "ml-2" : ""}>{item.title}</span>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="flex items-center">
                {item.icon && <item.icon className="h-4 w-4" />}
                <span className={item.icon ? "ml-2" : ""}>{item.title}</span>
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}