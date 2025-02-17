"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageOff, Loader2 } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatBalance } from "@/lib/utils"
import { withdrawToAddress } from "@/app/actions/wallets/withdraw"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface WithdrawFormProps {
  wallet: LocalWallet
}

export function WithdrawForm({ wallet }: WithdrawFormProps) {
  const [amount, setAmount] = useState("")
  const [address, setAddress] = useState("")
  const [network, setNetwork] = useState("")
  const [memo, setMemo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleWithdraw = async () => {
    try {
      setIsSubmitting(true)
      
      const selectedNetwork = wallet.coin.networks.find(n => n.chain === network)
      if (!selectedNetwork) throw new Error("Network not selected")

      const result = await withdrawToAddress({
        walletId: wallet.id,
        networkId: selectedNetwork.id,
        address,
        amount,
        ...(memo && { memo }),
      })

      if (result.success) {
        toast.success("Withdrawal request submitted")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to process withdrawal")
      }
    } catch (error) {
      toast.error("Failed to process withdrawal")
      console.error("Withdrawal error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedNetwork = wallet.coin.networks.find(n => n.chain === network)

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
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
          onClick={handleWithdraw}
          disabled={!amount || !address || !network || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Withdraw ${wallet.symbol}`
          )}
        </Button>
      </CardContent>
    </Card>
  )
}