import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const withdraws = await db.withdrawHistory.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    })

    return NextResponse.json(withdraws)
  } catch (error) {
    console.error("Error fetching withdraws:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}