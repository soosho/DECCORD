import { syncCCPaymentCoins } from "@/app/actions/ccpayments/sync-coins"
import { NextResponse } from "next/server"
export const runtime = 'nodejs'

export async function POST(request: Request) {
    try {
      const result = await syncCCPaymentCoins();
      return NextResponse.json({ success: true, data: result });
    } catch (error) {
      console.error("❌ Error syncing coins:", error);
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }
}

export async function GET() {
  try {
    const result = await syncCCPaymentCoins();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error syncing coins:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}