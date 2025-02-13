import { TransactionTable } from "./transaction-table"
import { type Transaction } from "@/types/recent-faucet-transaction"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="rounded-xl bg-card">
      <div className="p-6">
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  )
}