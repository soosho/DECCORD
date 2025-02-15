"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { DepositStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Copy, Check } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface DepositRecord {
  id: string
  gateway: string
  symbol: string
  amount: string
  status: DepositStatus
  date: string
  txid: string | null
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
    accessorKey: "gateway",
    header: "Gateway",
    cell: ({ row }: { row: any }) => (
      <Badge variant="outline">
        {row.getValue("gateway")}
      </Badge>
    )
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: any }) => {
      const status = row.getValue("status") as DepositStatus
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
    accessorKey: "date",
    header: "Date",
    cell: ({ row }: { row: any }) => (
      <div className="text-left">
        {formatDateTime(new Date(row.getValue("date")))}
      </div>
    ),
  },
]

export function DepositHistory() {
  const [deposits, setDeposits] = useState<DepositRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const loadDeposits = async () => {
      try {
        const response = await fetch(`/api/history/deposits?page=${page}`)
        if (!response.ok) throw new Error("Failed to fetch deposits")
        const data = await response.json()
        setDeposits(data.deposits)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error("Error loading deposits:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDeposits()
  }, [page])

  return (
    <Card>
      <CardContent>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={deposits}
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      </CardContent>
    </Card>
  )
}