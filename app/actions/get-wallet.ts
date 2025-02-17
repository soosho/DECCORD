"use server"

import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"

export async function getWalletData(symbol: string) {
  try {
    const user = await currentUser()
    if (!user) throw new Error("Unauthorized")

    const wallet = await db.wallets.findFirst({
      where: {
        ownerId: user.id,
        coin: {
          symbol: symbol.toUpperCase()
        }
      },
      include: {
        coin: {
          include: {
            networks: {
              where: {
                canDeposit: true
              }
            }
          }
        },
        addresses: {
          include: {
            network: {
              select: {
                chain: true,
                chainFullName: true,
                minimumDepositAmount: true,
                minimumWithdrawAmount: true,
                maximumWithdrawAmount: true
              }
            }
          }
        }
      }
    })

    if (!wallet) return null

    // Serialize all Decimal values including nested network objects
    return {
      ...wallet,
      balance: wallet.balance.toString(),
      coin: {
        ...wallet.coin,
        minimumDeposit: wallet.coin.minimumDeposit.toString(),
        networks: wallet.coin.networks.map(network => ({
          ...network,
          minimumDepositAmount: network.minimumDepositAmount.toString(),
          minimumWithdrawAmount: network.minimumWithdrawAmount.toString(),
          maximumWithdrawAmount: network.maximumWithdrawAmount.toString()
        }))
      },
      addresses: wallet.addresses.map(addr => ({
        ...addr,
        network: {
          ...addr.network,
          minimumDepositAmount: addr.network.minimumDepositAmount.toString(),
          minimumWithdrawAmount: addr.network.minimumWithdrawAmount.toString(),
          maximumWithdrawAmount: addr.network.maximumWithdrawAmount.toString()
        }
      }))
    }
  } catch (error) {
    console.error("Error fetching wallet:", error)
    return null
  }
}