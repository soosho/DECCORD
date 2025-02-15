"use server"

import { z } from "zod"
import crypto from "crypto"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { Decimal } from "@prisma/client/runtime/library"
import { Prisma, WithdrawStatus, CcpaymentStatus } from "@prisma/client"

// Add environment variable validation
if (!process.env.CCPAYMENT_APP_ID) throw new Error("CCPAYMENT_APP_ID not configured")
if (!process.env.CCPAYMENT_APP_SECRET) throw new Error("CCPAYMENT_APP_SECRET not configured")

const CCPAYMENT_APP_ID = process.env.CCPAYMENT_APP_ID
const CCPAYMENT_APP_SECRET = process.env.CCPAYMENT_APP_SECRET

// Add CCPayment API endpoints
const CCPAYMENT_API = {
  withdraw: "https://ccpayment.com/ccpayment/v2/applyAppWithdrawToNetwork",
  status: "https://ccpayment.com/ccpayment/v2/getAppWithdrawRecord"
} as const

const withdrawSchema = z.object({
  walletId: z.string(),
  networkId: z.string(),
  address: z.string(),
  amount: z.string(),
  memo: z.string().optional(),
})

export async function withdrawToAddress(formData: z.infer<typeof withdrawSchema>) {
  try {
    console.log('🚀 Starting withdrawal process:', { formData })
    
    const user = await currentUser()
    if (!user) throw new Error("Unauthorized")
    console.log('👤 User authenticated:', { userId: user.id })

    // Validate input
    const data = withdrawSchema.parse(formData)
    console.log('✅ Input validated:', { data })

    // Get wallet and verify ownership with ccPayment_coin_id
    const wallet = await db.wallets.findFirst({
      where: {
        id: data.walletId,
        ownerId: user.id,
      },
      include: {
        coin: {
          select: {
            symbol: true,
            ccPaymentCoinId: true, // Updated casing to match Prisma schema
            withdrawFee: true
          }
        },
      }
    })

    if (!wallet) throw new Error("Wallet not found")
    if (!wallet.coin.ccPaymentCoinId) throw new Error("Coin not configured for withdrawals")

    console.log('💰 Wallet found:', { 
      walletId: wallet.id, 
      symbol: wallet.coin.symbol,
      ccPaymentCoinId: wallet.coin.ccPaymentCoinId // Updated casing here too
    })

    // Get network details
    const network = await db.networks.findFirst({
      where: {
        id: data.networkId,
      }
    })

    if (!network) throw new Error("Network not found")
    console.log('🌐 Network found:', { 
      networkId: network.id, 
      chain: network.chain 
    })

    // Generate orderId
    const orderId = `WD_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`
    console.log('📝 Generated orderId:', orderId)

    // Update CCPayment request payload
    const args = JSON.stringify({
      coinId: Number(wallet.coin.ccPaymentCoinId), // Updated casing here
      chain: network.chain,
      address: data.address,
      orderId: orderId,
      amount: data.amount,
      ...(data.memo && { memo: data.memo }),
    })
    console.log('📤 CCPayment request payload:', JSON.parse(args))

    // Generate signature
    const timestamp = Math.floor(Date.now() / 1000)
    const signText = CCPAYMENT_APP_ID + timestamp + args
    const sign = crypto
      .createHmac("sha256", CCPAYMENT_APP_SECRET)
      .update(signText)
      .digest("hex")
    
    console.log('🔐 Request headers:', {
      appId: CCPAYMENT_APP_ID,
      timestamp,
      signLength: sign.length,
      signPrefix: sign.substring(0, 10) + '...'
    })

    // Make request to CCPayment
    console.log('⏳ Sending request to CCPayment...')
    const response = await fetch(CCPAYMENT_API.withdraw, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Appid": CCPAYMENT_APP_ID,
        "Sign": sign,
        "Timestamp": timestamp.toString(),
      },
      body: args,
    })

    const responseText = await response.text()
    console.log('📥 CCPayment response:', {
      status: response.status,
      ok: response.ok,
      body: responseText
    })

    if (response.ok) {
      const responseData = JSON.parse(responseText)
      if (responseData.code === 10000) { // Success response
        // Begin transaction with explicit types
        await db.$transaction(async (tx) => {
          // Create withdraw history
          const withdrawHistory = await tx.withdrawHistory.create({
            data: {
              id: responseData.data.recordId,
              userId: user.id,
              withdrawType: "Network",
              symbol: wallet.coin.symbol,
              network: network.chain,
              receiver: data.address,
              status: "Processing" as WithdrawStatus,
              amount: new Decimal(data.amount),
              feeSymbol: wallet.coin.symbol,
              feeAmount: wallet.coin.withdrawFee || new Decimal(0),
            }
          })

          // Create CCPayment withdraw record
          const ccpaymentWithdraw = await tx.ccpaymentWithdraws.create({
            data: {
              recordId: responseData.data.recordId,
              userId: user.id,
              walletId: wallet.id,
              symbol: wallet.coin.symbol,
              amount: new Decimal(data.amount),
              address: data.address,
              status: "Processing" as CcpaymentStatus
            }
          })

          // Update wallet balance
          await tx.wallets.update({
            where: { id: wallet.id },
            data: {
              balance: {
                decrement: new Decimal(data.amount).plus(wallet.coin.withdrawFee || new Decimal(0))
              }
            }
          })

          return { withdrawHistory, ccpaymentWithdraw }
        })

        revalidatePath("/dashboard")
        revalidatePath("/wallets")
        console.log('✨ Withdrawal process completed successfully')

        return { success: true, recordId: responseData.data.recordId }
      }
    }

    if (!response.ok) {
      throw new Error(`Withdrawal failed: ${responseText}`)
    }

    revalidatePath("/dashboard")
    revalidatePath("/wallets")
    console.log('✨ Withdrawal process completed successfully')

    return { success: true, orderId }
  } catch (error) {
    console.error('❌ Withdrawal error:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : error,
      formData
    })
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}