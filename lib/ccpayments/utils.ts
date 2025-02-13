import crypto from "crypto"
import { CCPaymentConfig } from './types'

export function generateSignature(
  config: CCPaymentConfig, 
  timestamp: number, 
  args: string
): string {
  let signText = config.appId + timestamp
  if (args.length !== 0) {
    signText += args
  }

  return crypto
    .createHmac("sha256", config.appSecret)
    .update(signText)
    .digest("hex")
}