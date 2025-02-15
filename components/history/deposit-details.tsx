"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/ui/copy-button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { DepositStatus } from "@prisma/client"
import { formatDateTime } from "@/lib/utils/format-date"
import { ImageOff } from "lucide-react"

interface DepositDetailsProps {
  isOpen: boolean
  onClose: () => void
  deposit: {
    id: string
    gateway: string
    symbol: string
    amount: string
    status: DepositStatus
    date: string
    txid: string | null
  } | null
}

export function DepositDetails({ isOpen, onClose, deposit }: DepositDetailsProps) {
  if (!deposit) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10 bg-background pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center bg-muted rounded-full">
              {deposit.symbol ? (
                <>
                  <Image
                    src={`/icons/coins/${deposit.symbol.toLowerCase()}.svg`}
                    alt={`${deposit.symbol} icon`}
                    width={32}
                    height={32}
                    style={{ width: '32px', height: '32px' }}
                    className="object-contain"
                    priority={true}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="fallback-icon absolute inset-0 hidden items-center justify-center">
                    <ImageOff className="w-5 h-5 text-muted-foreground" />
                  </div>
                </>
              ) : (
                <ImageOff className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <DialogTitle>Deposit Details</DialogTitle>
              <DialogDescription>
                Transaction information for your {deposit.symbol} deposit
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 text-center">
                  <p className="text-sm font-medium">Status</p>
                  <Badge 
                    className={
                      deposit.status === "Success" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400" 
                        : deposit.status === "Failed"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400"
                    }
                    variant="outline"
                  >
                    {deposit.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-xs font-mono">
                    {Number(deposit.amount).toFixed(8)}
                  </p>
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-sm font-medium">Currency</p>
                  <p className="text-xs">
                    {deposit.symbol.toUpperCase()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Transaction ID:</p>
                  <div className="flex items-center gap-2 border rounded-md pl-3 pr-1.5 h-10">
                    <code className="text-[13px] font-mono break-all flex-1">
                      {deposit.id}
                    </code>
                    <CopyButton value={deposit.id} />
                  </div>
                </div>

                {deposit.txid && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Blockchain TX ID:</p>
                    <div className="flex items-center gap-2 border rounded-md pl-3 pr-1.5 h-10">
                      <code className="text-[13px] font-mono break-all flex-1">
                        {deposit.txid}
                      </code>
                      <CopyButton value={deposit.txid} />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Gateway</p>
                  <Badge variant="outline" className="w-fit">
                    {deposit.gateway}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-xs">
                    {formatDateTime(new Date(deposit.date))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}