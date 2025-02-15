import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"

const ITEMS_PER_PAGE = 10

export async function GET(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * ITEMS_PER_PAGE

    const [deposits, total] = await Promise.all([
      db.depositHistory.findMany({
        where: {
          userId: user.id
        },
        orderBy: {
          date: 'desc'
        },
        skip,
        take: ITEMS_PER_PAGE,
      }),
      db.depositHistory.count({
        where: {
          userId: user.id
        }
      })
    ])

    // Convert Decimal to string for serialization
    const serializedDeposits = deposits.map(deposit => ({
      ...deposit,
      amount: deposit.amount.toString(),
      date: deposit.date.toISOString()
    }))

    return NextResponse.json({
      deposits: serializedDeposits,
      totalPages: Math.ceil(total / ITEMS_PER_PAGE),
      currentPage: page
    })
  } catch (error) {
    console.error("Error fetching deposits:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}