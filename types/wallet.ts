export interface WalletNetwork {
  id: string
  chain: string
  chainFullName: string
  minimumDepositAmount: string
  minimumWithdrawAmount: string
  maximumWithdrawAmount: string
  canDeposit: boolean
  canWithdraw: boolean
  isSupportMemo: boolean
}

export interface WalletAddress {
  id: string
  address: string
  memo?: string | null
  network: WalletNetwork
}

export interface Wallet {
  id: string
  name: string
  symbol: string
  balance: string
  price: number
  addresses: WalletAddress[]
  coin: {
    api: string | null
    networks: WalletNetwork[]
    minimumDeposit: string
    minimumWithdraw: string
    withdrawFee: string
    coinStatus: string
    depositStatus: string
    withdrawStatus: string
    logoUrl: string
  }
}

export interface PnLData {
  initialValue: number
  currentValue: number
  netTransfers: number
  timestamp: string
  dayOpenPrice: number
  dayOpenBalance: string
  lastUpdate: string
}

export interface LocalWallet {
  balance: string
  price: number
  symbol: string
  name: string
}

export interface WalletWithPnL extends LocalWallet {
  pnlData?: PnLData
}

export interface PortfolioHistory {
  date: string
  value: number
  change: number
  changePercentage: number
}