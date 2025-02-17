import { notFound } from "next/navigation"
import { DepositWalletDetails } from "@/components/deposit/deposit-wallet-details"
import { FaucetPay } from "@/components/deposit/faucet-pay"
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { ImageOff } from "lucide-react"

interface DepositPageProps {
  params: Promise<{ symbol: string }>
}

export default async function DepositCoinPage({ params }: DepositPageProps) {
  const { symbol } = await params
  const user = await currentUser()
  
  if (!user) {
    notFound()
  }

  const coin = await db.coins.findFirst({
    where: {
      symbol: symbol.toUpperCase(),
      coinStatus: "active"
    },
    select: {
      name: true,
      symbol: true,
      logoUrl: true,
      minimumDeposit: true,
      allowedNetworks: true // Add this field
    }
  })

  const wallet = await db.wallets.findFirst({
    where: {
      ownerId: user.id,
      coin: { symbol: symbol.toUpperCase() }
    },
    select: {
      id: true,
      addresses: {
        select: {
          id: true,
          address: true,
          memo: true,
          network: {
            select: {
              chain: true,
              chainFullName: true
            }
          }
        }
      },
      coin: {
        select: {
          networks: {
            where: { 
              chain: { in: coin?.allowedNetworks }, // Filter by allowed networks
              canDeposit: true 
            },
            select: {
              id: true,
              chain: true,
              chainFullName: true,
              canDeposit: true
            }
          }
        }
      }
    }
  })

  if (!wallet || !coin) {
    notFound()
  }

  // Check if coin is supported by FaucetPay
  const FAUCETPAY_SUPPORTED_COINS = [
    "BTC", "ETH", "DOGE", "LTC", "BCH", "DASH", "DGB", 
    "TRX", "USDT", "FEY", "ZEC", "BNB", "SOL", "XRP", 
    "POL", "ADA", "TON", "XLM", "USDC", "XMR", "TARA", 
    "TRUMP", "PEPE"
  ]
  const isFaucetPaySupported = FAUCETPAY_SUPPORTED_COINS.includes(coin.symbol)

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card className="border-none shadow-none">
        <CardContent className="p-6 space-y-6">
          {/* Coin Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4 pb-6">
              {coin.logoUrl ? (
                <Image
                  src={coin.logoUrl}
                  alt={coin.name}
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
                <CardTitle className="text-2xl">{coin.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Minimum deposit: {coin.minimumDeposit.toString()} {coin.symbol}
                </p>
              </div>
            </CardHeader>
          </Card>

          {/* Deposit Methods Tabs */}
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="direct" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="direct">Direct Deposit</TabsTrigger>
                  {isFaucetPaySupported && (
                    <TabsTrigger value="faucetpay">FaucetPay</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="direct">
                  <DepositWalletDetails 
                    walletId={wallet.id}
                    networks={wallet.coin.networks}
                    addresses={wallet.addresses}
                  />
                </TabsContent>

                {isFaucetPaySupported && (
                  <TabsContent value="faucetpay">
                    <FaucetPay 
                      symbol={coin.symbol}
                      userId={user.id}
                    />
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>

          {/* Important Notes Card */}
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-medium mb-2">Important Notes:</h3>
              <ul className="list-disc pl-4 space-y-1.5 text-sm text-muted-foreground">
                <li>Please double-check the network before making a deposit</li>
                <li>Only send {coin.symbol} to this address</li>
                <li>Sending other tokens may result in permanent loss</li>
                <li>Deposits will be credited after network confirmation</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}