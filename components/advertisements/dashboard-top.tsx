"use client"

import { Card } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight, Construction } from "lucide-react"
import Link from "next/link"

export function DashboardAdsTop() {
  return (
    <Card className="bg-gradient-to-r from-muted/50 to-muted p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2 flex flex-col justify-center gap-2">
          <div className="flex items-center gap-2">
            <Construction className="h-6 w-6 text-yellow-500" />
            <h1 className="text-2xl font-bold tracking-tight">
              Under Development
            </h1>
          </div>
          <p className="text-muted-foreground">
            This website is currently under development. We are building a crypto exchange
            using NextJS, React, and Tailwind CSS. If you are interested in this project,
            feel free to reach out.
          </p>
          <div className="flex gap-2">
            <Link 
              href="https://t.me/Blackdveil"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ 
                variant: "default",
                size: "sm",
                className: "mt-2"
              })}
            >
              Contact Developer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="grid gap-1">
            <div className="text-sm font-medium">Tech Stack</div>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>• NextJS</span>
              <span>• React</span>
              <span>• Tailwind CSS</span>
              <span>• TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}