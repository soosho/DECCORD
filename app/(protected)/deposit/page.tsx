"use client"

import { DepositWalletList } from "@/components/deposit/deposit-wallet-list"

export default function DepositPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Deposit Crypto</h2>
      <DepositWalletList />
    </div>
  )
}