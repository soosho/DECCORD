"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label } from 'recharts'
import { calculatePnL } from "@/lib/pnl"

interface WalletCardProps {
  wallets: {
    balance: string
    price: number
    symbol: string
    name: string
    pnlData?: {
      initialValue: number
      netTransfers: number
    }
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

export function WalletCard({ wallets }: WalletCardProps) {
  // Calculate total portfolio value
  const totalValue = wallets.reduce((total, wallet) => {
    const walletValue = parseFloat(wallet.balance) * wallet.price
    return total + walletValue
  }, 0)

  // Calculate PnL
  const todaysPnL = calculatePnL(
    totalValue,
    wallets.reduce((sum, w) => sum + (w.pnlData?.initialValue || 0), 0),
    wallets.reduce((sum, w) => sum + (w.pnlData?.netTransfers || 0), 0)
  )

  // Prepare data for bar chart
  const chartData = wallets
    .filter(wallet => parseFloat(wallet.balance) > 0)
    .map(wallet => ({
      name: wallet.symbol,
      value: parseFloat(wallet.balance) * wallet.price,
      percentage: ((parseFloat(wallet.balance) * wallet.price / totalValue) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10) // Show top 10 by default

  // Updated modern color palette with gradients
  const COLORS = [
    'hsl(221 83% 53%)',   // Blue
    'hsl(142 71% 45%)',   // Green
    'hsl(47 95% 53%)',    // Yellow
    'hsl(192 95% 50%)',   // Cyan
    'hsl(283 39% 53%)',   // Purple
    'hsl(346 87% 61%)',   // Pink
    'hsl(154 68% 46%)',   // Emerald
    'hsl(16 92% 45%)',    // Orange
    'hsl(199 89% 48%)',   // Sky
    'hsl(326 72% 44%)',   // Rose
  ]

  const radialGradientIds = COLORS.map((_, index) => `radialGradient-${index}`)

  return (
    <div className="grid gap-4">
      <Card className="w-full max-w-2xl"> {/* Changed from max-w-md */}
        <CardHeader className="pb-4"> {/* Increased padding */}
          <div className="flex items-center justify-between gap-6"> {/* Increased gap */}
            <div className="flex-shrink space-y-4">
              {/* Existing portfolio value section */}
              <div>
                <CardTitle className="text-base font-medium text-muted-foreground"> {/* Increased font size */}
                  Portfolio Value
                </CardTitle>
                <div className="text-2xl font-semibold tracking-tight mt-2"> {/* Increased font and margin */}
                  {formatUsdValue(totalValue)}
                </div>
              </div>

              {/* Add PnL section */}
              <div className="border-t pt-3">
                <div className="text-sm text-muted-foreground">
                  Today's PnL
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={cn(
                    "font-medium",
                    todaysPnL.isPositive ? "text-emerald-500" : "text-red-500"
                  )}>
                    {todaysPnL.isPositive ? "+" : "-"} {formatUsdValue(Math.abs(todaysPnL.value))}
                    <span className="text-xs ml-0.5">
                      ({todaysPnL.isPositive ? "+" : ""}{todaysPnL.percentage.toFixed(2)}%)
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="h-[140px] w-[140px] flex-shrink-0"> {/* Increased chart size */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {COLORS.map((color, index) => (
                      <radialGradient
                        key={radialGradientIds[index]}
                        id={radialGradientIds[index]}
                        cx="50%"
                        cy="50%"
                        r="50%"
                        fx="50%"
                        fy="50%"
                      >
                        <stop
                          offset="0%"
                          stopColor={color}
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor={color}
                          stopOpacity={0.6}
                        />
                      </radialGradient>
                    ))}
                  </defs>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="100%"
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                    animationBegin={0}
                    animationDuration={1200}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#${radialGradientIds[index % radialGradientIds.length]})`}
                        stroke="hsl(var(--border))"  // Changed from --background to --border
                        strokeWidth={0.5}            // Reduced stroke width for subtlety
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background/80 backdrop-blur-sm border px-3 py-2 rounded-lg shadow-lg">
                            <div className="font-medium">{data.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatUsdValue(data.value)}
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}