import { CCPaymentConfig, CoinListResponse } from '../types'
import { generateSignature } from '../utils'

export async function getCoinList(config: CCPaymentConfig): Promise<CoinListResponse> {
  const timestamp = Math.floor(Date.now() / 1000)
  const args = ''
  const sign = generateSignature(config, timestamp, args)
  const apiUrl = 'https://ccpayment.com/ccpayment/v2/getCoinList'
  
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Appid": config.appId,
        "Sign": sign,
        "Timestamp": timestamp.toString(),
      },
      body: args,
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const text = await response.text()

    try {
      return JSON.parse(text) as CoinListResponse
    } catch (error: unknown) {
      const parseError = error instanceof Error ? error : new Error(String(error))
      throw new Error(`Failed to parse response: ${parseError.message}`)
    }
  } catch (error: unknown) {
    const apiError = error instanceof Error ? error : new Error(String(error))
    throw apiError
  }
}