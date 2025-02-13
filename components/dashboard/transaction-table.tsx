"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { type Transaction } from "@/types/recent-faucet-transaction"

interface TransactionTableProps {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Filter transactions not older than 3 days
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  
  const filteredTransactions = transactions
    .filter(transaction => transaction.date >= threeDaysAgo)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
  
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Recent Faucet Transactions</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Received from</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.source}</TableCell>
                <TableCell>
                  {transaction.amount.toFixed(8)} {transaction.currency}
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{formatDistanceToNow(transaction.date, { addSuffix: true })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="flex items-center justify-center py-4 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}