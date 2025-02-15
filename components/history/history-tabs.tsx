"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentDeposits } from "./recent-deposits"
import { RecentWithdraws } from "./recent-withdraws"
import { DepositHistory } from "./deposit-history"
import { WithdrawHistory } from "./withdraw-history"

export function HistoryTabs() {
  return (
    <Tabs defaultValue="recent" className="space-y-4">
      <TabsList>
        <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
        <TabsTrigger value="deposits">All Deposits</TabsTrigger>
        <TabsTrigger value="withdrawals">All Withdrawals</TabsTrigger>
      </TabsList>
      <TabsContent value="recent" className="space-y-4">
        <RecentDeposits />
        <RecentWithdraws />
      </TabsContent>
      <TabsContent value="deposits">
        <DepositHistory />
      </TabsContent>
      <TabsContent value="withdrawals">
        <WithdrawHistory />
      </TabsContent>
    </Tabs>
  )
}