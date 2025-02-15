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

    const [withdraws, total] = await Promise.all([
      db.withdrawHistory.findMany({
        where: {
          userId: user.id
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: ITEMS_PER_PAGE,
      }),
      db.withdrawHistory.count({
        where: {
          userId: user.id
        }
      })
    ])

    // Convert Decimal to string for serialization
    const serializedWithdraws = withdraws.map(withdraw => ({
      ...withdraw,
      amount: withdraw.amount.toString(),
      feeAmount: withdraw.feeAmount.toString(),
      createdAt: withdraw.createdAt.toISOString(),
      updatedAt: withdraw.updatedAt.toISOString()
    }))

    return NextResponse.json({
      withdraws: serializedWithdraws,
      totalPages: Math.ceil(total / ITEMS_PER_PAGE),
      currentPage: page
    })
  } catch (error) {
    console.error("Error fetching withdraws:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}