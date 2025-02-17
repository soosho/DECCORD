"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ImageOff } from "lucide-react"
import Image from "next/image"

interface Coin {
  id: string
  name: string 
  symbol: string
  logoUrl: string
  allowedNetworks: string[]
  withdrawStatus: string
}

export default function WithdrawPage() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [search, setSearch] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch("/api/coins")
        if (!response.ok) throw new Error("Failed to fetch coins")
        const data = await response.json()
        // Filter only coins that can be withdrawn
        const withdrawableCoins = data.filter(
          (coin: Coin) => coin.withdrawStatus === "active"
        )
        setCoins(withdrawableCoins)
      } catch (error) {
        console.error("Error fetching coins:", error)
      }
    }

    fetchCoins()
  }, [])

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Withdraw Crypto</h2>
      
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search coins..."
            value={search}
            onChange={e => setSearch(e.target.value)} 
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCoins.map(coin => (
            <Card 
              key={coin.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => router.push(`/withdraw/${coin.symbol}`)}
            >
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                {coin.logoUrl ? (
                  <Image
                    src={coin.logoUrl}
                    alt={coin.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <ImageOff className="h-4 w-4" />
                  </div>
                )}
                <CardTitle>{coin.name} ({coin.symbol})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {coin.allowedNetworks.map(network => (
                    <Badge key={network} variant="secondary">
                      {network}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}