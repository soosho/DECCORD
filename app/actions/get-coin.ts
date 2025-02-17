"use server"

import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"

export async function getCoinBySymbol(symbol: string) {
  try {
    const user = await currentUser()
    if (!user) throw new Error("Unauthorized")

    const coin = await db.coins.findFirst({
      where: {
        symbol: symbol.toUpperCase(),
        coinStatus: "active"
      },
      select: {
        id: true,
        name: true,
        symbol: true,
        chainId: true,
        price: true,
        api: true,
        allowedNetworks: true,
        minimumDeposit: true,
        minimumWithdraw: true,
        withdrawFee: true,
        coinStatus: true,
        depositStatus: true,
        withdrawStatus: true,
        ccPaymentCoinId: true,
        coinFullName: true,
        logoUrl: true,
        networks: {
          where: {
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
    })

    if (!coin) return null

    // Serialize all Decimal fields to strings
    const serializedCoin = {
      ...coin,
      price: coin.price?.toString() || "0",
      minimumDeposit: coin.minimumDeposit?.toString() || "0",
      minimumWithdraw: coin.minimumWithdraw?.toString() || "0",
      withdrawFee: coin.withdrawFee?.toString() || "0",
    }

    return serializedCoin
  } catch (error) {
    console.error("Error fetching coin:", error)
    return null
  }
}