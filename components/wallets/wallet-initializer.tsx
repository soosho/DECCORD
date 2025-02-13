import { createMissingWallets } from "@/app/actions/create-wallets"

export async function WalletInitializer() {
  await createMissingWallets()
  return null
}