import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  
  if (!session?.userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Your protected API logic here
  return NextResponse.json({ 
    message: "Protected data",
    userId: session.userId
  })
}