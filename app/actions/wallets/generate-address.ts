"use server"

import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { CCPaymentClient } from "@/lib/ccpayments"
import { revalidatePath } from "next/cache"

const ccpayment = new CCPaymentClient({
  appId: process.env.CCPAYMENT_APP_ID!,
  appSecret: process.env.CCPAYMENT_APP_SECRET!,
  baseUrl: process.env.CCPAYMENT_API_URL || "https://ccpayment.com"
})

export async function generateWalletAddress(walletId: string, networkId: string) {
  try {
    const user = await currentUser()
    if (!user) throw new Error("Unauthorized")

    // Enhanced wallet query to include network details
    const wallet = await db.wallets.findFirst({
      where: {
        id: walletId,
        ownerId: user.id,  // Updated to use user.id
      },
      include: {
        coin: true,
        addresses: {
          where: {
            networkId: networkId
          }
        }
      }
    })

    if (!wallet) throw new Error("Wallet not found")
    if (wallet.coin.api !== "ccpayment") throw new Error("Invalid payment provider")

    // Get network details with more info
    const network = await db.networks.findFirst({
      where: { 
        id: networkId,
        coinId: wallet.coin.id,
        // Only select networks that match allowed chains
        chain: {
          in: wallet.coin.allowedNetworks as string[]
        }
      },
      select: {
        id: true,
        chain: true,
        canDeposit: true,
        chainFullName: true
      }
    })

    if (!network) {
      return {
        success: false,
        message: `Network not available. Please choose from: ${(wallet.coin.allowedNetworks as string[]).join(', ')}`,
        availableNetworks: wallet.coin.allowedNetworks
      }
    }

    if (!network.canDeposit) {
      return {
        success: false,
        message: `Deposits are currently disabled for ${network.chainFullName}`,
        availableNetworks: wallet.coin.allowedNetworks
      }
    }

    // Skip if address already exists
    if (wallet.addresses.length > 0) {
      return {
        success: true,
        message: "Address already exists",
        address: wallet.addresses[0].address,
        memo: wallet.addresses[0].memo
      }
    }

    // Generate address only if network is allowed
    const response = await ccpayment.getOrCreateDepositAddress({
      referenceId: user.id,  // Updated to use user.id
      chain: network.chain // This will be one of ["ETH","BSC","TRX"]
    })

    if (response.code !== 10000) {
      throw new Error(`CCPayment error: ${response.msg}`)
    }

    // Create wallet address
    const walletAddress = await db.walletAddresses.create({
      data: {
        walletId: wallet.id,
        networkId: network.id,
        address: response.data.address,
        memo: response.data.memo || null,
      }
    })

    revalidatePath("/wallets")

    return {
      success: true,
      address: walletAddress.address,
      memo: walletAddress.memo
    }
  } catch (error) {
    console.error("Error generating address:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}