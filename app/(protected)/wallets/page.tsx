import { WalletCard } from "@/components/wallets/card"
import { WalletList } from "@/components/wallets/wallet-list"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { createMissingWallets } from "@/app/actions/create-wallets"
import { redirect } from "next/navigation"
import { getCoinLogoUrl } from "@/lib/utils"

export default async function WalletsPage() {
  const { userId } = auth()
  
  // Security check: Ensure user is authenticated
  if (!userId) {
    redirect("/sign-in")
  }

  // Initialize wallets
  await createMissingWallets()

  // Security: Only fetch wallets for the authenticated user
  const wallets = await db.wallets.findMany({
    where: {
      ownerId: userId!,  // Only get current user's wallets
    },
    include: {
      coin: {
        include: {
          networks: true
        }
      },
      addresses: {
        include: {
          network: true
        }
      }
    }
  })

  // Transform data for the WalletList component
  const formattedWallets = wallets.map(wallet => ({
    id: wallet.id,
    name: wallet.coin.name,
    symbol: wallet.coin.symbol,
    balance: wallet.balance.toString(),
    price: Number(wallet.coin.price),
    addresses: wallet.addresses.map(addr => ({
      id: addr.id,
      address: addr.address,
      memo: addr.memo,
      network: {
        id: addr.network.id,
        chain: addr.network.chain,
        chainFullName: addr.network.chainFullName,
        // Convert Decimal values to strings
        minimumDepositAmount: addr.network.minimumDepositAmount.toString(),
        minimumWithdrawAmount: addr.network.minimumWithdrawAmount.toString(),
        maximumWithdrawAmount: addr.network.maximumWithdrawAmount.toString(),
        canDeposit: addr.network.canDeposit,
        canWithdraw: addr.network.canWithdraw,
        isSupportMemo: addr.network.isSupportMemo
      }
    })),
    coin: {
      api: wallet.coin.api,
      networks: wallet.coin.networks.map(network => ({
        id: network.id,
        chain: network.chain,
        chainFullName: network.chainFullName,
        // Convert Decimal values to strings
        minimumDepositAmount: network.minimumDepositAmount.toString(),
        minimumWithdrawAmount: network.minimumWithdrawAmount.toString(),
        maximumWithdrawAmount: network.maximumWithdrawAmount.toString(),
        canDeposit: network.canDeposit,
        canWithdraw: network.canWithdraw,
        isSupportMemo: network.isSupportMemo
      })),
      minimumDeposit: wallet.coin.minimumDeposit.toString(),
      minimumWithdraw: wallet.coin.minimumWithdraw.toString(),
      withdrawFee: wallet.coin.withdrawFee.toString(),
      coinStatus: wallet.coin.coinStatus,
      depositStatus: wallet.coin.depositStatus,
      withdrawStatus: wallet.coin.withdrawStatus,
      logoUrl: getCoinLogoUrl(wallet.coin.symbol)
    }
  }))

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Wallets</h2>
      </div>
      
      <div className="grid gap-4">
        <WalletCard wallets={formattedWallets} />
        <WalletList wallets={formattedWallets} />
      </div>
    </div>
  )
}