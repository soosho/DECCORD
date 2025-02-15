import { HistoryTabs } from "@/components/history/history-tabs"

export default async function HistoryPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
      <HistoryTabs />
    </div>
  )
}