import { StatCard } from "./stat-card"

interface StatCardsProps {
  wallets: {
    balance: string
    price: number
  }[]
}

function formatUsdValue(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

export function StatCards({ wallets }: StatCardsProps) {
  // Calculate total portfolio value using the same logic
  const totalValue = wallets.reduce((total, wallet) => {
    const walletValue = parseFloat(wallet.balance) * wallet.price
    return total + walletValue
  }, 0)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Portfolio Value"
        value={formatUsdValue(totalValue)}
        description="Total value of your portfolio"
      />
      <StatCard
        title="Coins Collected Today"
        value="$0.005"
        description="Total coins collected in the last 24h"
      />
      <StatCard
        title="Payouts Received Today"
        value="18"
        description="Number of payouts received today"
      />
      <StatCard
        title="Reward Points"
        value="19,033"
        description="Total reward points earned"
      />
    </div>
  )
}