"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// List of supported FaucetPay coins
const FAUCETPAY_SUPPORTED_COINS = [
  "BTC", "ETH", "DOGE", "LTC", "BCH", "DASH", "DGB", 
  "TRX", "USDT", "FEY", "ZEC", "BNB", "SOL", "XRP", 
  "POL", "ADA", "TON", "XLM", "USDC", "XMR", "TARA", 
  "TRUMP", "PEPE"
]

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
})

interface FaucetPayProps {
  symbol: string
  userId: string
}

export function FaucetPay({ symbol, userId }: FaucetPayProps) {
  // Check if coin is supported by FaucetPay
  if (!FAUCETPAY_SUPPORTED_COINS.includes(symbol)) {
    return null
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  })

  return (
    <div className="space-y-4">
      <form 
        action="https://faucetpay.io/merchant/webscr" 
        method="post"
        className="space-y-4"
      >
        {/* Hidden inputs */}
        <input type="hidden" name="merchant_username" value={process.env.NEXT_PUBLIC_FAUCETPAY_MERCHANT_USERNAME} />
        <input type="hidden" name="item_description" value={`Deposit ${symbol}`} />
        <input type="hidden" name="currency1" value={symbol} />
        <input type="hidden" name="currency2" value={symbol} />
        <input type="hidden" name="custom" value={userId} />
        <input type="hidden" name="callback_url" value={process.env.NEXT_PUBLIC_FAUCETPAY_CALLBACK_URL} />
        <input type="hidden" name="success_url" value={process.env.NEXT_PUBLIC_FAUCETPAY_SUCCESS_URL} />
        <input type="hidden" name="cancel_url" value={process.env.NEXT_PUBLIC_FAUCETPAY_CANCEL_URL} />

        <Form {...form}>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount ({symbol})</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="Enter amount"
                    {...field}
                    name="amount1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>

        <Button type="submit" className="w-full">
          Pay with FaucetPay
        </Button>
      </form>
    </div>
  )
}