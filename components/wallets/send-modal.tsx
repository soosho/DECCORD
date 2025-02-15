"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageOff } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatBalance } from "@/lib/utils"

interface SendModalProps {
  isOpen: boolean
  onClose: () => void
  wallet: LocalWallet | null
}

export function SendModal({ isOpen, onClose, wallet }: SendModalProps) {
  const [amount, setAmount] = useState("")
  const [address, setAddress] = useState("")
  const [network, setNetwork] = useState("")
  const [memo, setMemo] = useState("")

  if (!wallet) return null

  const handleSend = async () => {
    // TODO: Implement send logic
    console.log("Sending transaction:", { amount, address, network, memo })
  }

  const selectedNetwork = wallet.coin.networks.find(n => n.chain === network)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center">
              {wallet.coin.logoUrl ? (
                <Image
                  src={wallet.coin.logoUrl}
                  alt={`${wallet.symbol} icon`}
                  width={32}
                  height={32}
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : (
                <ImageOff className="w-5 h-5 text-muted-foreground" />
              )}
              <ImageOff className="w-5 h-5 text-muted-foreground hidden absolute" />
            </div>
            <DialogTitle>Send {wallet.symbol}</DialogTitle>
          </div>
          <DialogDescription>
            Available Balance: {formatBalance(wallet.balance)} {wallet.symbol}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Network Selection */}
          <div className="space-y-2">
            <Label htmlFor="network">Network</Label>
            <Select
              value={network}
              onValueChange={setNetwork}
            >
              <SelectTrigger id="network">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                {wallet.coin.networks.map((net) => (
                  <SelectItem key={net.chain} value={net.chain}>
                    <div className="flex items-center gap-2">
                      <div className="relative w-4 h-4">
                        <Image
                          src={`/icons/coins/${net.chain.toUpperCase()}.svg`}
                          alt=""
                          width={16}
                          height={16}
                          className="object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                      <span>{net.chainFullName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount (Min: ${selectedNetwork?.minimumWithdrawAmount || '0'} ${wallet.symbol})`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2"
                onClick={() => setAmount(wallet.balance)}
              >
                MAX
              </Button>
            </div>
          </div>

          {/* Address Input */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter recipient address"
            />
          </div>

          {/* Memo Input (if required) */}
          {selectedNetwork?.isSupportMemo && (
            <div className="space-y-2">
              <Label htmlFor="memo">
                Memo <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Enter memo"
              />
            </div>
          )}

          {/* Fee Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Network Fee</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBalance(wallet.coin.withdrawFee)} {wallet.symbol}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">You will receive</p>
                  <p className="text-xs text-muted-foreground">
                    {amount ? formatBalance((parseFloat(amount) - parseFloat(wallet.coin.withdrawFee)).toString()) : "0"} {wallet.symbol}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full" 
            onClick={handleSend}
            disabled={!amount || !address || !network}
          >
            Send {wallet.symbol}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}