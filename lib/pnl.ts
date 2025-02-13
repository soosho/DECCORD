import { WalletWithPnL, PnLData } from "@/types/wallet"

// Create a new utility file for PnL calculations
export function calculatePnL(currentValue: number, initialValue: number, netTransfers: number) {
  const pnl = currentValue - initialValue - netTransfers
  const denominator = initialValue + netTransfers
  const pnlPercentage = denominator === 0 ? 0 : ((pnl / denominator) * 100)
  
  return {
    value: pnl,
    percentage: pnlPercentage,
    isPositive: pnl >= 0
  }
}

export function calculateDailyPnL(wallet: WalletWithPnL): {
  value: number
  percentage: number
  isPositive: boolean
} {
  if (!wallet.pnlData) {
    return { value: 0, percentage: 0, isPositive: true }
  }

  const { dayOpenPrice, dayOpenBalance } = wallet.pnlData
  const currentValue = parseFloat(wallet.balance) * wallet.price
  const openValue = parseFloat(dayOpenBalance) * dayOpenPrice

  const pnl = currentValue - openValue - wallet.pnlData.netTransfers
  const denominator = openValue + wallet.pnlData.netTransfers
  const percentage = denominator === 0 ? 0 : ((pnl / denominator) * 100)

  return {
    value: pnl,
    percentage,
    isPositive: pnl >= 0
  }
}

export function initializeDailyPnL(wallet: WalletWithPnL): PnLData {
  return {
    initialValue: parseFloat(wallet.balance) * wallet.price,
    currentValue: parseFloat(wallet.balance) * wallet.price,
    netTransfers: 0,
    dayOpenPrice: wallet.price,
    dayOpenBalance: wallet.balance,
    timestamp: new Date().toISOString(),
    lastUpdate: new Date().toISOString()
  }
}

export function updatePnL(wallet: WalletWithPnL, transfer: number = 0): WalletWithPnL {
  const now = new Date()
  const pnlData = wallet.pnlData || initializeDailyPnL(wallet)
  
  // Reset PnL data if it's a new day
  if (isNewDay(pnlData.timestamp)) {
    return {
      ...wallet,
      pnlData: initializeDailyPnL(wallet)
    }
  }

  // Update existing PnL data
  return {
    ...wallet,
    pnlData: {
      ...pnlData,
      currentValue: parseFloat(wallet.balance) * wallet.price,
      netTransfers: pnlData.netTransfers + transfer,
      lastUpdate: now.toISOString()
    }
  }
}

function isNewDay(timestamp: string): boolean {
  const date = new Date(timestamp)
  const now = new Date()
  
  return date.getDate() !== now.getDate() ||
         date.getMonth() !== now.getMonth() ||
         date.getFullYear() !== now.getFullYear()
}