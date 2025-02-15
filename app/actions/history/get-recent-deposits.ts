"use server"

import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"

export async function getRecentDeposits() {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  const deposits = await db.depositHistory.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      date: 'desc'
    },
    take: 10
  })

  // Convert Decimal to string for serialization
  return deposits.map(deposit => ({
    ...deposit,
    amount: deposit.amount.toString(),
    date: deposit.date.toISOString()
  }))
}