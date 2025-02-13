import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const wallet = await db.wallets.findFirst({
      where: {
        id: params.id,
        ownerId: userId,
      },
      include: {
        coin: {
          include: {
            networks: true,
          },
        },
        addresses: {
          include: {
            network: true,
          },
        },
      },
    })

    if (!wallet) {
      return new NextResponse("Wallet not found", { status: 404 })
    }

    // Format the data
    const formattedWallet = {
      id: wallet.id,
      name: wallet.coin.name,
      symbol: wallet.coin.symbol,
      balance: wallet.balance.toString(),
      addresses: wallet.addresses.map(addr => ({
        id: addr.id,
        address: addr.address,
        memo: addr.memo,
        network: {
          id: addr.network.id,
          chain: addr.network.chain,
          chainFullName: addr.network.chainFullName,
        }
      })),
      coin: {
        api: wallet.coin.api,
        minimumDeposit: wallet.coin.minimumDeposit.toString(),
        minimumWithdraw: wallet.coin.minimumWithdraw.toString(),
        withdrawFee: wallet.coin.withdrawFee.toString(),
        coinStatus: wallet.coin.coinStatus,
        depositStatus: wallet.coin.depositStatus,
        withdrawStatus: wallet.coin.withdrawStatus,
        networks: wallet.coin.networks,
      }
    }

    return NextResponse.json(formattedWallet)
  } catch (error) {
    console.error("Error fetching wallet:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}