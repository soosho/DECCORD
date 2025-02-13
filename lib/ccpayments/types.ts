export interface CCPaymentConfig {
  appId: string
  appSecret: string
  baseUrl: string
}

// Add network and coin interfaces
export interface CCPaymentNetwork {
  chain: string
  chainFullName: string
  contract: string
  precision: number
  canDeposit: boolean
  canWithdraw: boolean
  minimumDepositAmount: string
  minimumWithdrawAmount: string
  maximumWithdrawAmount: string
  isSupportMemo: boolean
}

export interface CCPaymentCoin {
  coinId: number
  symbol: string
  coinFullName: string
  logoUrl: string
  status: string
  networks: Record<string, CCPaymentNetwork>
  price: string
}

// Base response interface
interface BaseResponse {
  code: number
  msg: string
}

// Specific response for wallet address creation
export interface AddressResponse extends BaseResponse {
  data: {
    address: string
    memo: string
  }
}

// Specific response for coin list
export interface CoinListResponse extends BaseResponse {
  data: {
    coins: CCPaymentCoin[]
  }
}

// Export the general type for other responses
export type CCPaymentResponse = AddressResponse | CoinListResponse