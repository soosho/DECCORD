import { CCPaymentConfig, AddressResponse } from '../types'
import { generateSignature } from '../utils'

export async function getOrCreateDepositAddress(
  config: CCPaymentConfig,
  params: { referenceId: string, chain: string }
): Promise<AddressResponse> {
  const timestamp = Math.floor(Date.now() / 1000)
  const args = JSON.stringify(params)
  const sign = generateSignature(config, timestamp, args)
  
  // Use the correct endpoint URL format
  const apiUrl = 'https://ccpayment.com/ccpayment/v2/getOrCreateAppDepositAddress'
  
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
      const data = JSON.parse(text)
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Response is not an object')
      }

      if (typeof data.code !== 'number') {
        throw new Error('Missing or invalid code')
      }

      if (data.code !== 10000) {
        throw new Error(`CCPayment error: ${data.msg || 'Unknown error'}`)
      }

      if (!data.data?.address) {
        throw new Error('Missing address in response')
      }

      return {
        code: data.code,
        msg: data.msg,
        data: {
          address: data.data.address,
          memo: data.data.memo || ''
        }
      }
    } catch (parseError) {
      console.error('Response parsing error:', {
        error: parseError,
        text,
        params
      })
      if (parseError instanceof Error) {
        throw new Error(`Invalid response format: ${parseError.message}`)
      } else {
        throw new Error('Invalid response format')
      }
    }
  } catch (error) {
    console.error('CCPayment API error:', {
      error,
      params
    })
    throw error instanceof Error ? error : new Error(String(error))
  }
}