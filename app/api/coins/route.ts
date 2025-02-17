import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const coins = await db.coins.findMany({
      where: {
        coinStatus: "active"
      },
      select: {
        id: true,
        name: true,
        symbol: true,
        logoUrl: true,
        allowedNetworks: true // Include the allowedNetworks column
      }
    })

    return NextResponse.json(coins)
  } catch (error) {
    console.error("Error fetching coins:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}