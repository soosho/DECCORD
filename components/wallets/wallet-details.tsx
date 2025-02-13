"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import QRCode from "react-qr-code"
import { Loader2, PlusCircle, ImageOff } from "lucide-react" // Add import for Image and ImageOff
import { generateWalletAddress } from "@/app/actions/wallets/generate-address"
import { CopyButton } from "@/components/ui/copy-button"
import { formatBalance } from "@/lib/utils" // Add this import
import { Card, CardContent } from "@/components/ui/card" // Add this import
import Image from "next/image" // Add import for Image
import { Wallet } from "@/types/wallet"

interface WalletDetailsProps {
  isOpen: boolean
  onClose: () => void
  wallet: Wallet | null
  onWalletUpdate: (updatedWallet: Wallet) => void
}

type StatusType = "active" | "deactive" | "maintenance"

function getStatusColor(status: StatusType) {
  switch (status) {
    case "active":
      return "bg-green-500/15 text-green-500 hover:bg-green-500/25"
    case "maintenance":
      return "bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/25"
    case "deactive":
      return "bg-red-500/15 text-red-500 hover:bg-red-500/25"
    default:
      return ""
  }
}

export function WalletDetails({ isOpen, onClose, wallet, onWalletUpdate }: WalletDetailsProps) {
  // Keep track of networks being processed
  const [processingNetworks, setProcessingNetworks] = useState<Set<string>>(new Set())
  const [generatingAddress, setGeneratingAddress] = useState(false)
  const [activeNetwork, setActiveNetwork] = useState<string>("")

  // Reset active network when wallet changes
  useEffect(() => {
    if (wallet?.addresses?.[0]) {
      setActiveNetwork(wallet.addresses[0].network.chain)
    }
  }, [wallet?.addresses])

  const handleGenerateAddresses = async () => {
    if (!wallet) return

    try {
      setGeneratingAddress(true)
      const networks = wallet.coin.networks
      
      for (const network of networks) {
        setProcessingNetworks(prev => new Set(Array.from(prev).concat(network.chain)))
        
        try {
          await generateWalletAddress(wallet.id, network.id)
          
          // Fetch updated wallet data after each network
          const response = await fetch(`/api/wallets/${wallet.id}`)
          if (!response.ok) throw new Error('Failed to fetch updated wallet data')
          
          const updatedWalletData = await response.json()
          
          // Preserve existing wallet properties while updating addresses
          const updatedWallet = {
            ...wallet,
            addresses: updatedWalletData.addresses,
            // Preserve these important properties
            price: wallet.price,
            balance: wallet.balance,
            coin: {
              ...wallet.coin,
              logoUrl: wallet.coin.logoUrl,
              // Update networks from the response
              networks: updatedWalletData.coin.networks
            }
          }
          
          onWalletUpdate(updatedWallet)
        } catch (error) {
          console.error(`Failed to generate address for ${network.chain}:`, error)
        }
        
        setProcessingNetworks(prev => {
          const next = new Set(prev)
          next.delete(network.chain)
          return next
        })
      }
    } catch (error) {
      console.error("Failed to generate addresses:", error)
    } finally {
      setGeneratingAddress(false)
      setProcessingNetworks(new Set())
    }
  }

  if (!wallet) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10 bg-background pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center bg-muted rounded-full">
              {wallet?.symbol ? (
                <>
                  <Image
                    src={`/icons/coins/${wallet.symbol}.svg`}
                    alt={`${wallet.symbol} icon`}
                    width={32}
                    height={32}
                    style={{ width: '32px', height: '32px' }}
                    className="object-contain"
                    priority={true}
                    onError={(e) => {
                      console.log('Image load error:', {
                        symbol: wallet.symbol,
                        path: `/icons/coins/${wallet.symbol}.svg`
                      });
                      e.currentTarget.style.display = 'none';
                      // Show fallback icon
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="fallback-icon absolute inset-0 hidden items-center justify-center">
                    <ImageOff className="w-5 h-5 text-muted-foreground" />
                  </div>
                </>
              ) : (
                <ImageOff className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <DialogTitle>{wallet.name} ({wallet.symbol})</DialogTitle>
          </div>
          <DialogDescription>
            View wallet details and manage your {wallet.symbol} addresses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Generate Address Button */}
          {wallet.addresses.length === 0 && wallet.coin.api === "ccpayment" && (
            <Button
              className="w-full"
              variant="outline"
              disabled={generatingAddress}
              onClick={handleGenerateAddresses}
            >
              {generatingAddress ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Addresses ({processingNetworks.size} remaining)...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Generate Deposit Addresses
                </>
              )}
            </Button>
          )}

          {/* Status Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 text-center">
                  <p className="text-sm font-medium">Network</p>
                  <Badge className={getStatusColor(wallet.coin.coinStatus as StatusType)} variant="outline">
                    {wallet.coin.coinStatus}
                  </Badge>
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-sm font-medium">Deposit</p>
                  <Badge className={getStatusColor(wallet.coin.depositStatus as StatusType)} variant="outline">
                    {wallet.coin.depositStatus}
                  </Badge>
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-sm font-medium">Withdraw</p>
                  <Badge className={getStatusColor(wallet.coin.withdrawStatus as StatusType)} variant="outline">
                    {wallet.coin.withdrawStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Section */}
          {wallet.addresses.length > 0 ? (
            <Tabs
              value={activeNetwork}
              onValueChange={setActiveNetwork}
              className="w-full"
            >
              <TabsList className="p-1 mx-auto w-fit">
                {wallet.addresses.map(addr => (
                  <TabsTrigger 
                    key={addr.network.chain} 
                    value={addr.network.chain}
                    className="px-2.5 sm:px-3"
                  >
                    <code className="flex items-center gap-1 text-[13px] [&>svg]:h-4 [&>svg]:w-4">
                      <div className="relative w-4 h-4 flex items-center justify-center">
                        <Image
                          src={`/icons/coins/${addr.network.chain.toUpperCase()}.svg`}
                          alt=""
                          width={16}
                          height={16}
                          style={{ width: '16px', height: '16px' }}  // Fixed dimensions
                          className="object-contain w-auto h-auto"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.parentElement?.classList.add('hidden')
                          }}
                        />
                      </div>
                      <span className="uppercase">{addr.network.chain}</span>
                    </code>
                  </TabsTrigger>
                ))}
              </TabsList>

              {wallet.addresses.map(addr => (
                <TabsContent 
                  key={addr.network.chain} 
                  value={addr.network.chain}
                  className="mt-4"
                >
                  {/* ...existing QR and address content... */}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              No deposit addresses generated yet
            </div>
          )}

          {/* QR Code Card */}
          {wallet.addresses.length > 0 && (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center bg-white p-4 rounded-lg">
                    <QRCode
                      value={wallet.addresses.find(addr => addr.network.chain === activeNetwork)?.address || ""}
                      style={{ height: "160px", width: "160px" }}
                      level="L"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Deposit Address Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {(() => {
                      const currentAddress = wallet.addresses.find(
                        addr => addr.network.chain === activeNetwork
                      )
                      if (!currentAddress) return null

                      return (
                        <>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Deposit Address:</p>
                            <div className="flex items-center gap-2 border rounded-md pl-3 pr-1.5 h-10">
                              <code className="text-[13px] font-mono break-all flex-1">
                                {currentAddress.address}
                              </code>
                              <CopyButton value={currentAddress.address} size="sm" variant="ghost" className="h-7 w-7" />
                            </div>
                          </div>

                          {currentAddress.memo && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Memo:</p>
                              <div className="flex items-center gap-2 border rounded-md pl-3 pr-1.5 h-10">
                                <code className="text-[13px] font-mono break-all flex-1">
                                  {currentAddress.memo}
                                </code>
                                <CopyButton value={currentAddress.memo} size="sm" variant="ghost" className="h-7 w-7" />
                              </div>
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Limits Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Min Deposit</p>
                  <p className="text-xs">
                    {formatBalance(wallet.coin.minimumDeposit)} {wallet.symbol}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Min Withdraw</p>
                  <p className="text-xs">
                    {formatBalance(wallet.coin.minimumWithdraw)} {wallet.symbol}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Withdraw Fee</p>
                  <p className="text-xs">
                    {formatBalance(wallet.coin.withdrawFee)} {wallet.symbol}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}