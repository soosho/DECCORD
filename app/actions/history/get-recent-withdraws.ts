"use server"

import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"

export async function getRecentWithdraws() {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  return await db.withdrawHistory.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  })
}