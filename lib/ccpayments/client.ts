import { CCPaymentConfig, AddressResponse, CoinListResponse } from "./types"
import { getOrCreateDepositAddress } from './endpoints/get-deposit-address'
import { getCoinList } from './endpoints/get-coin-list' // Add this import

export class CCPaymentClient {
  private config: CCPaymentConfig

  constructor(config: CCPaymentConfig) {
    this.config = config
  }

  async getOrCreateDepositAddress(
    params: { referenceId: string, chain: string }
  ): Promise<AddressResponse> {
    const response = await getOrCreateDepositAddress(this.config, params)
    if (!response.data?.address) {
      throw new Error('Invalid address response from CCPayment API')
    }
    return response
  }

  // Update this method to use the dedicated endpoint handler
  async getCoinList(): Promise<CoinListResponse> {
    return getCoinList(this.config)
  }
}