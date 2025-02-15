import { RecentDeposits } from "@/components/history/recent-deposits"
import { RecentWithdraws } from "@/components/history/recent-withdraws"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Transaction History</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Track your recent deposits and withdrawals. For a complete history of your transactions, use the view all button in each section.
        </p>
      </div>

      <div className="space-y-6">
        {/* Deposits Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium leading-none">Recent Deposits</h3>
            <Link href="/history/deposit">
              <Button variant="outline" size="sm" className="h-8">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <RecentDeposits />
        </div>

        {/* Withdraws Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium leading-none">Recent Withdraws</h3>
            <Link href="/history/withdraw">
              <Button variant="outline" size="sm" className="h-8">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <RecentWithdraws />
        </div>
      </div>
    </div>
  )
}