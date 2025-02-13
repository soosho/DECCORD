"use server"

import { db } from "@/lib/db"
import { CCPaymentClient } from "@/lib/ccpayments"
import { revalidatePath } from "next/cache"
import { CCPaymentCoin, CCPaymentNetwork, CoinListResponse } from "@/lib/ccpayments/types"
import { CoinStatus } from "@prisma/client"

// Add this interface at the top of the file with other imports
interface SyncResult {
  symbol: string;
  status: 'success' | 'error';
  message?: string;
}

const ccpayment = new CCPaymentClient({
  appId: process.env.CCPAYMENT_APP_ID!,
  appSecret: process.env.CCPAYMENT_APP_SECRET!,
  baseUrl: process.env.CCPAYMENT_API_URL || "https://ccpayment.com"
})

// Define IGNORED_NETWORKS before using it
const IGNORED_NETWORKS = [
  'ARETH',
  'OPTIMISM',
  'AVAX',
  'BASE',
  'OPBNB'
]

function formatName(name: string): string {
  const nameMap: Record<string, string> = {
    "Litecoin Token": "Litecoin",
    "Zcash Token": "Zcash",
    "Bitcoin Cash Token": "Bitcoin Cash",
    "Tron Blockchain": "Tron",
    "ChainLink Token": "ChainLink",
    "Polygon Ecosystem Token": "Polygon",
    "XRP Ledger Blockchain": "XRP"
  }

  return nameMap[name] || name
}

export async function syncCCPaymentCoins() {
  try {
    const response = await ccpayment.getCoinList();

    if (response.code !== 10000) {
      throw new Error(`CCPayment error: ${response.msg}`);
    }

    const coins = response.data.coins;
    const results: SyncResult[] = [];

    for (const coin of coins) {
      try {
        // Find minimum withdraw amount across all networks
        const minWithdrawAmount = Object.values(coin.networks)
          .filter(network => !IGNORED_NETWORKS.includes(network.chain))
          .reduce((min, network) => {
            const amount = parseFloat(network.minimumWithdrawAmount);
            return amount < min ? amount : min;
          }, Number.MAX_VALUE);

        // Ensure allowedNetworks is always an array
        const allowedNetworks =
          coin.symbol === 'DADDY' ? ['SOL'] :
          coin.symbol === 'SPACE' ? ['POLYGON'] :
          coin.symbol === 'BTC' ? ['BTC'] :
          coin.symbol === 'XLM' ? ['XLM'] :
          coin.symbol === 'TON' ? ['TON'] :
          coin.symbol === 'BabyDoge' ? ['BSC'] :
          coin.symbol === 'PEPE' ? ['ETH'] :
          coin.symbol === 'POL' ? ['POLYGON', 'ETH'] :
          coin.symbol === 'LINK' ? ['ETH', 'BSC'] :
          coin.symbol === 'BONK' ? ['SOL'] :
          coin.symbol === 'TRX' ? ['TRX'] :
          coin.symbol === 'BNB' ? ['BSC'] :
          coin.symbol === 'DGB' ? ['DGB'] :
          coin.symbol === 'RVN' ? ['RVN'] :
          coin.symbol === 'TRUMP' ? ['SOL'] :
          coin.symbol === 'SHIB' ? ['BSC', 'ETH'] :
          coin.symbol === 'BCH' ? ['BCH', 'BSC'] :
          coin.symbol === 'ADA' ? ['ADA'] :
          coin.symbol === 'DASH' ? ['DASH'] :
          coin.symbol === 'SOL' ? ['SOL'] :
          coin.symbol === 'USDT' ? ['TRX', 'BSC', 'ETH'] :
          coin.symbol === 'XRP' ? ['XRP', 'BSC'] :
          coin.symbol === 'MANA' ? ['ETH'] :
          coin.symbol === 'DOGE' ? ['DOGE'] :
          coin.symbol === 'ZEC' ? ['BSC'] :
          coin.symbol === 'LTC' ? ['LTC', 'BSC'] :
          coin.symbol === 'BAT' ? ['ETH', 'BSC'] :
          coin.symbol === 'TETH' ? ['ETH_SEPOLIA'] :
          coin.symbol === 'ETH' ? ['ETH', 'BSC'] :
          coin.symbol === 'BFG' ? ['BSC'] :
          coin.symbol === 'USDC' ? ['ETH', 'BSC', 'TRX'] :
          Array.isArray(Object.values(coin.networks).map(n => n.chain))
            ? Object.values(coin.networks).map(n => n.chain)
            : ['UNKNOWN']; // Fallback if empty

        // Prepare coin data for database update
        const coinData = {
          name: formatName(coin.coinFullName),
          symbol: coin.symbol,
          price: coin.price,
          api: "ccpayment",
          ccPaymentCoinId: coin.coinId,
          coinFullName: formatName(coin.coinFullName),
          logoUrl: coin.logoUrl,
          coinStatus: coin.status === "Normal" ? CoinStatus.active : CoinStatus.maintenance,
          minimumDeposit: "0",
          minimumWithdraw: minWithdrawAmount.toString(),
          withdrawFee: "0",
          allowedNetworks
        };

        // Upsert the coin into the database
        const updatedCoin = await db.coins.upsert({
          where: { symbol: coin.symbol },
          create: coinData,
          update: coinData,
        });

        // Process networks, filtering out ignored ones
        const filteredNetworks = Object.entries(coin.networks)
          .filter(([chainName]) => !IGNORED_NETWORKS.includes(chainName));

        for (const [chainName, network] of filteredNetworks) {
          await db.networks.upsert({
            where: {
              coinId_chain: {
                coinId: updatedCoin.id,
                chain: network.chain,
              },
            },
            create: {
              coinId: updatedCoin.id,
              chain: network.chain,
              chainFullName: formatName(network.chainFullName),
              contract: network.contract,
              precision: network.precision,
              canDeposit: network.canDeposit,
              canWithdraw: network.canWithdraw,
              minimumDepositAmount: network.minimumDepositAmount,
              minimumWithdrawAmount: network.minimumWithdrawAmount,
              maximumWithdrawAmount: network.maximumWithdrawAmount,
              isSupportMemo: network.isSupportMemo,
            },
            update: {
              chainFullName: formatName(network.chainFullName),
              contract: network.contract,
              precision: network.precision,
              canDeposit: network.canDeposit,
              canWithdraw: network.canWithdraw,
              minimumDepositAmount: network.minimumDepositAmount,
              minimumWithdrawAmount: network.minimumWithdrawAmount,
              maximumWithdrawAmount: network.maximumWithdrawAmount,
              isSupportMemo: network.isSupportMemo,
            },
          });
        }

        // Add success result
        results.push({
          symbol: coin.symbol,
          status: 'success'
        });
      } catch (error) {
        // Add error result
        results.push({
          symbol: coin.symbol,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Revalidate cache after update
    revalidatePath("/admin/coins");

    // Return success response without NextResponse
    return {
      success: true,
      message: `Synced ${coins.length} coins`,
      data: results
    };

  } catch (error) {
    console.error("Error syncing coins:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}
