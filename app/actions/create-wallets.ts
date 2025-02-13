"use server"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"

export async function createMissingWallets() {
  try {
    const { userId } = auth()
    if (!userId) throw new Error("Unauthorized")

    // Get all active coins
    const coins = await db.coins.findMany({
      where: {
        coinStatus: "active"
      },
      select: {
        id: true
      }
    })

    // Get user's existing wallets
    const existingWallets = await db.wallets.findMany({
      where: {
        ownerId: userId
      },
      select: {
        coinId: true
      }
    })

    const existingCoinIds = new Set(existingWallets.map(w => w.coinId))

    // Create array of wallets to create
    const walletsToCreate = coins
      .filter(coin => !existingCoinIds.has(coin.id))
      .map(coin => ({
        ownerId: userId,
        coinId: coin.id,
        balance: 0
      }))

    if (walletsToCreate.length === 0) {
      return { success: true, message: "No new wallets needed" }
    }

    // Create missing wallets
    const created = await db.wallets.createMany({
      data: walletsToCreate
    })

    return {
      success: true,
      message: `Created ${created.count} new wallets`
    }
  } catch (error) {
    console.error("Failed to create wallets:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create wallets"
    }
  }
}