import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBalance(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  const formatted = num.toFixed(8)
  return formatted.replace(/\.?0+$/, '')
}

export function getCoinLogoUrl(symbol: string): string {
  // Try to use local SVG icon first
  const localPath = `/icons/coins/${symbol.toUpperCase()}.svg`
  return localPath
}
