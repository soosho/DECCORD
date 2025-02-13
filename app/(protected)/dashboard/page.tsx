import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { StatCards } from "@/components/dashboard/stat-cards"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { ChatBox } from "@/components/dashboard/chat-box"
import { demoTransactions } from "@/components/dashboard/data/transactions"
import { DashboardAdsTop } from "@/components/advertisements/dashboard-top"
import { DashboardAdsBottom } from "@/components/advertisements/dashboard-bottom"

export default async function Dashboard() {
  const user = await currentUser()
  
  if (!user) {
    redirect("/sign-in")
  }

  const wallets = await db.wallets.findMany({
    where: {
      ownerId: user.id,
    },
    include: {
      coin: true
    }
  })

  const formattedWallets = wallets.map(wallet => ({
    balance: wallet.balance.toString(),
    price: Number(wallet.coin.price)
  }))

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardAdsTop />
      <div className="grid gap-4 lg:grid-cols-[1fr,400px]">
        <div className="flex flex-col gap-4">
          <StatCards wallets={formattedWallets} />
          <RecentTransactions transactions={demoTransactions} />
        </div>
        <div className="lg:block">
          <ChatBox />
        </div>
      </div>
      <DashboardAdsBottom />
    </div>
  )
}