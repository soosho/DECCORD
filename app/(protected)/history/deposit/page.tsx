import { DepositHistory } from "@/components/history/deposit-history"

export default function DepositHistoryPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Deposit History</h2>
      </div>
      
      <div className="grid gap-4">
        <DepositHistory />
      </div>
    </div>
  )
}