"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { WithdrawStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Eye } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { WalletIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WithdrawDetails } from "@/components/history/withdraw-details"

interface WithdrawRecord {
  id: string
  symbol: string
  network: string
  amount: string
  status: WithdrawStatus
  createdAt: string
  txid: string | null
  receiver: string
  feeAmount: string
  feeSymbol: string
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-4 w-4"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  )
}

const formatDateTime = (date: Date) => {
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  
  const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return `${timeFormatter.format(date)}, ${dateFormatter.format(date)}`
}

export function WithdrawHistory() {
  const [withdraws, setWithdraws] = useState<WithdrawRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawRecord | null>(null)

  const serializeWithdraw = (withdraw: WithdrawRecord) => {
    return {
      ...withdraw,
      amount: withdraw.amount.toString(),
      feeAmount: withdraw.feeAmount.toString(),
      createdAt: new Date(withdraw.createdAt).toISOString(),
    }
  }

  useEffect(() => {
    const loadWithdraws = async () => {
      try {
        setError(null)
        setLoading(true)
        const response = await fetch(`/api/history/withdraws?page=${page}`)
        if (!response.ok) throw new Error("Failed to fetch withdraws")
        const data = await response.json()
        setWithdraws(data.withdraws)
        setTotalPages(data.totalPages)
      } catch (error) {
        setError("Failed to load withdraw history. Please try again.")
        console.error("Error loading withdraws:", error)
      } finally {
        setLoading(false)
      }
    }

    loadWithdraws()
  }, [page])

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: { row: any }) => {
        const id = row.getValue("id") as string
        const shortId = id.slice(0, 5) + "..."
        
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">{shortId}</span>
                  <CopyButton text={id} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">{id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
    },
    {
      accessorKey: "symbol",
      header: "Currency",
      cell: ({ row }: { row: any }) => {
        const symbol = row.getValue("symbol") as string
        return (
          <div className="flex items-center gap-2">
            <Image 
              src={`/icons/coins/${symbol.toLowerCase()}.svg`} 
              alt={symbol}
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span>{symbol.toUpperCase()}</span>
          </div>
        )
      }
    },
    {
      accessorKey: "network",
      header: "Network",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: { row: any }) => {
        const symbol = row.getValue("symbol") as string
        return (
          <span className="font-mono">
            {Number(row.getValue("amount")).toFixed(8)} {symbol.toUpperCase()}
          </span>
        )
      }
    },
    {
      accessorKey: "txid",
      header: "Transaction ID",
      cell: ({ row }: { row: any }) => {
        const txid = row.getValue("txid") as string | null
        if (!txid) return <span className="text-muted-foreground">Pending...</span>
        
        const shortTxid = txid.slice(0, 8) + "..." + txid.slice(-8)
        
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">{shortTxid}</span>
                  <CopyButton text={txid} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">{txid}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
    },
    {
      accessorKey: "feeAmount",
      header: "Fee",
      cell: ({ row }: { row: any }) => {
        const originalRow = row.original as WithdrawRecord
        return (
          <span className="font-mono">
            {Number(row.getValue("feeAmount")).toFixed(8)} {originalRow.feeSymbol.toUpperCase()}
          </span>
        )
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status") as WithdrawStatus
        return (
          <Badge 
            className={
              status === "Success" 
                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400" 
                : status === "Failed"
                ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400"
            }
            variant="outline"
          >
            {status}
          </Badge>
        )
      }
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <div className="text-left">
            {formatDateTime(new Date(row.getValue("createdAt")))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedWithdraw(row.original as WithdrawRecord)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : loading ? (
          <div className="h-[450px] flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : withdraws.length === 0 ? (
          <EmptyState
            icon={WalletIcon}
            title="No withdrawals found"
            description="When you make withdrawals, they will appear here."
          />
        ) : (
          <DataTable 
            columns={columns} 
            data={withdraws}
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <WithdrawDetails
          isOpen={!!selectedWithdraw}
          onClose={() => setSelectedWithdraw(null)}
          withdraw={selectedWithdraw ? serializeWithdraw(selectedWithdraw) : null}
        />
      </CardContent>
    </Card>
  )
}