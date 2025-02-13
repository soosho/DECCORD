import { WalletWithPnL, PnLData } from "@/types/wallet"

const WALLET_PNL_KEY = 'wallet-pnl-data'

interface StoredPnLData {
  [symbol: string]: PnLData
}

export function storePnLData(wallets: WalletWithPnL[]) {
  const pnlData: StoredPnLData = {}
  
  wallets.forEach(wallet => {
    if (wallet.pnlData) {
      pnlData[wallet.symbol] = {
        initialValue: parseFloat(wallet.balance) * wallet.price,
        currentValue: parseFloat(wallet.balance) * wallet.price,
        netTransfers: 0,
        timestamp: new Date().toISOString(),
        dayOpenPrice: wallet.price,
        dayOpenBalance: wallet.balance,
        lastUpdate: new Date().toISOString()
      }
    }
  })

  localStorage.setItem(WALLET_PNL_KEY, JSON.stringify(pnlData))
}

export function getPnLData(): StoredPnLData {
  const stored = localStorage.getItem(WALLET_PNL_KEY)
  if (!stored) return {}
  
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

export function initializeWalletPnL(wallets: WalletWithPnL[]): WalletWithPnL[] {
  const storedPnL = getPnLData()
  const now = new Date()
  
  return wallets.map(wallet => {
    const stored = storedPnL[wallet.symbol]
    
    // If no stored data or it's a new day, initialize new PnL data
    if (!stored || isNewDay(stored.timestamp)) {
      return {
        ...wallet,
        pnlData: {
          initialValue: parseFloat(wallet.balance) * wallet.price,
          currentValue: parseFloat(wallet.balance) * wallet.price,
          netTransfers: 0,
          timestamp: now.toISOString(),
          dayOpenPrice: wallet.price,
          dayOpenBalance: wallet.balance,
          lastUpdate: now.toISOString()
        }
      }
    }
    
    // Use stored data but update current value
    return {
      ...wallet,
      pnlData: {
        ...stored,
        currentValue: parseFloat(wallet.balance) * wallet.price,
        lastUpdate: now.toISOString()
      }
    }
  })
}

export function initializeDailyPnL(wallet: WalletWithPnL) {
  const now = new Date().toISOString()
  
  if (!wallet.pnlData || isNewDay(wallet.pnlData.timestamp)) {
    wallet.pnlData = {
      initialValue: parseFloat(wallet.balance) * wallet.price,
      currentValue: parseFloat(wallet.balance) * wallet.price,
      netTransfers: 0,
      timestamp: now,
      dayOpenPrice: wallet.price,
      dayOpenBalance: wallet.balance,
      lastUpdate: now
    }
  }
  
  return wallet
}

function isNewDay(timestamp: string): boolean {
  const date = new Date(timestamp)
  const now = new Date()
  
  return date.getDate() !== now.getDate() ||
         date.getMonth() !== now.getMonth() ||
         date.getFullYear() !== now.getFullYear()
}

export function recordTransfer(wallet: WalletWithPnL, amount: number) {
  if (!wallet.pnlData) {
    initializeDailyPnL(wallet)
  }
  
  if (wallet.pnlData) {
    wallet.pnlData.netTransfers += amount
  }
  
  return wallet
}