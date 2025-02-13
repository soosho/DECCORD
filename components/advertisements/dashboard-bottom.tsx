"use client"

import { Card } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight, Rocket, Shield, Zap } from "lucide-react"
import Link from "next/link"

export function DashboardAdsBottom() {
  return (
    <Card className="bg-gradient-to-r from-muted/50 via-muted to-muted/50 p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Features Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            PRO Features
          </h2>
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              <span className="text-sm">10x Faster Mining Speed</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Priority Support Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm">Exclusive Daily Rewards</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Mining Stats
          </h2>
          <div className="grid gap-2">
            <div>
              <div className="text-sm font-medium">Active Miners</div>
              <div className="text-2xl font-bold">14,325</div>
            </div>
            <div>
              <div className="text-sm font-medium">Total TON Mined</div>
              <div className="text-2xl font-bold">892,451</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col justify-center gap-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Ready to Earn More?
            </h2>
            <p className="text-sm text-muted-foreground">
              Upgrade to PRO now and start earning up to 10x more TON rewards!
            </p>
          </div>
          <Link 
            href="/pro"
            className={buttonVariants({ 
              size: "sm",
              className: "w-fit"
            })}
          >
            Upgrade Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  )
}