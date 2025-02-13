import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { CcpaymentStatus, CreditedStatus } from "@prisma/client"
import crypto from 'crypto'

// Add configuration
const CCPAYMENT_APP_ID = process.env.CCPAYMENT_APP_ID!
const CCPAYMENT_APP_SECRET = process.env.CCPAYMENT_APP_SECRET!
const ALLOWED_IPS = ['54.150.123.157', '35.72.150.75', '18.176.186.244', '182.253.163.135']

interface WebhookBody {
  type: string
  msg: {
    recordId: string
    referenceId: string
    coinId: number
    coinSymbol: string
    status: "Success" | "Processing"
    isFlaggedAsRisky: boolean
  }
}

function validateSignature(appId: string, timestamp: string, body: any, signature: string): boolean {
  let signText = `${appId}${timestamp}`
  
  // Check if body exists and is not null before using Object.keys
  if (body && typeof body === 'object') {
    signText += JSON.stringify(body)
  }

  const hmac = crypto.createHmac('sha256', CCPAYMENT_APP_SECRET)
  hmac.update(signText)
  const expectedSign = hmac.digest('hex')

  return signature === expectedSign
}

export async function POST(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json',
  }

  try {
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || ''
    
    // Enhanced logging
    console.log('\n=== CCPayment Webhook Request ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('IP Address:', ip)
    
    // Log all headers
    console.log('\n=== Raw Headers ===')
    headersList.forEach((value, key) => {
      console.log(`${key}: ${value}`)
    })

    // Log raw body
    const rawBody = await req.text()
    console.log('\n=== Raw Body ===')
    console.log(rawBody)

    let body = null
    try {
      body = rawBody ? JSON.parse(rawBody) as WebhookBody : null
      console.log('\n=== Parsed Body ===')
      console.log(JSON.stringify(body, null, 2))
    } catch (parseError) {
      console.error('\n=== Body Parse Error ===')
      console.error(parseError)
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    // Add null check for body
    if (!body) {
      return NextResponse.json(
        { error: "Missing request body" },
        { status: 400 }
      )
    }

    // Handle activation request - only IP check required
    if (body?.type === "ActivateWebhookURL") {
      console.log('✅ Webhook Activation Request Received')
      return Response.json({ msg: "success" }, { status: 200 })
    }

    // For all other webhook types, proceed with full validation
    // Validate headers
    const appId = headersList.get('appid')
    const timestamp = headersList.get('timestamp')
    const signature = headersList.get('sign')

    if (!appId || !timestamp || !signature || appId !== CCPAYMENT_APP_ID) {
      return NextResponse.json(
        { error: "Missing or invalid headers" },
        { status: 401 }
      )
    }

    // Validate timestamp (within 5 minutes)
    const timestampNum = parseInt(timestamp, 10)
    if (isNaN(timestampNum) || Math.abs(Date.now() / 1000 - timestampNum) > 300) {
      return NextResponse.json(
        { error: "Invalid or expired timestamp" },
        { status: 401 }
      )
    }

    // Validate signature
    if (!validateSignature(appId, timestamp, body, signature)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      )
    }

    // Log deposit webhook - Now safe to access body properties
    if (body.type === "DirectDeposit") {
      console.log('💰 Deposit Webhook Received:', {
        recordId: body.msg.recordId,
        coinSymbol: body.msg.coinSymbol,
        status: body.msg.status
      })
    }

    // Handle deposit webhook
    if (body.type !== "DirectDeposit") {
      return NextResponse.json(
        { error: "Invalid webhook type" },
        { status: 400 }
      )
    }

    // Create or update deposit record
    const deposit = await db.ccpaymentDeposits.upsert({
      where: {
        recordId: body.msg.recordId,
      },
      create: {
        recordId: body.msg.recordId,
        referenceId: body.msg.referenceId,
        coinId: body.msg.coinId,
        coinSymbol: body.msg.coinSymbol,
        status: body.msg.status as CcpaymentStatus,
        isFlaggedAsRisky: body.msg.isFlaggedAsRisky,
        credited: CreditedStatus.false,
      },
      update: {
        status: body.msg.status as CcpaymentStatus,
        isFlaggedAsRisky: body.msg.isFlaggedAsRisky,
      },
    })

    // If deposit is successful and not risky, update user's wallet balance
    if (body.msg.status === "Success" && !body.msg.isFlaggedAsRisky) {
      // TODO: Implement balance update logic
      // This should be done in a transaction with proper error handling
    }

    return NextResponse.json({ success: true, deposit }, {
      headers: corsHeaders
    })
  } catch (error) {
    console.error("\n=== CCPayment Webhook Error ===")
    console.error("Raw error:", error)
    
    if (error instanceof Error) {
      console.error('Detailed error:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n')
      })
    }
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      }), 
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

// Add GET handler
export async function GET(req: Request) {
  return new Response(
    JSON.stringify({ message: 'CCPayments webhook endpoint is active' }), 
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json',
      }
    }
  )
}

// Modify OPTIONS handler to be more permissive
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    },
  })
}