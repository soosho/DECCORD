import { notFound } from "next/navigation"
import { WithdrawForm } from "@/components/withdraw/withdraw-form"
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { ImageOff } from "lucide-react"
import { formatBalance } from "@/lib/utils"

interface WithdrawPageProps {
  params: Promise<{ symbol: string }>
}

export default async function WithdrawPage({ params }: WithdrawPageProps) {
  const { symbol } = await params
  const user = await currentUser()
  
  if (!user) {
    notFound()
  }

  const wallet = await db.wallets.findFirst({
    where: {
      ownerId: user.id,
      coin: { 
        symbol: symbol.toUpperCase(),
        withdrawStatus: "active"
      }
    },
    include: {
      coin: {
        include: {
          networks: {
            where: {
              canWithdraw: true
            }
          }
        }
      }
    }
  })

  if (!wallet) {
    notFound()
  }

  // Format wallet data to match LocalWallet interface
  const formattedWallet = {
    id: wallet.id,
    symbol: wallet.coin.symbol,
    name: wallet.coin.name,
    balance: wallet.balance.toString(),
    coin: {
      networks: wallet.coin.networks.map(network => ({
        id: network.id,
        chain: network.chain,
        chainFullName: network.chainFullName,
        minimumWithdrawAmount: network.minimumWithdrawAmount.toString(),
        maximumWithdrawAmount: network.maximumWithdrawAmount.toString(),
        canWithdraw: network.canWithdraw,
        isSupportMemo: network.isSupportMemo
      })),
      withdrawFee: wallet.coin.withdrawFee.toString(),
      logoUrl: wallet.coin.logoUrl
    }
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card className="border-none shadow-none">
        <CardContent className="p-6 space-y-6">
          {/* Coin Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4 pb-6">
              {wallet.coin.logoUrl ? (
                <Image
                  src={wallet.coin.logoUrl}
                  alt={wallet.coin.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <ImageOff className="h-5 w-5" />
                </div>
              )}
              <div className="space-y-1.5">
                <CardTitle className="text-2xl">{wallet.coin.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Available Balance: {formatBalance(wallet.balance.toString())} {wallet.coin.symbol}
                </p>
              </div>
            </CardHeader>
          </Card>

          {/* Withdraw Form */}
          <WithdrawForm wallet={formattedWallet} />

          {/* Important Notes */}
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-medium mb-2">Important Notes:</h3>
              <ul className="list-disc pl-4 space-y-1.5 text-sm text-muted-foreground">
                <li>Please double-check the network and address before withdrawing</li>
                <li>Make sure the receiving wallet supports the selected network</li>
                <li>Network fee will be deducted from the withdrawal amount</li>
                <li>Withdrawals cannot be cancelled once submitted</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}