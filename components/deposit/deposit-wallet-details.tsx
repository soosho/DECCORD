"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import QRCode from "react-qr-code"
import { CopyButton } from "@/components/ui/copy-button"
import { Loader2, AlertCircle } from "lucide-react"
import { generateWalletAddress } from "@/app/actions/wallets/generate-address"

interface Network {
  id: string
  chain: string
  chainFullName: string
  canDeposit: boolean
}

interface DepositWalletDetailsProps {
  walletId: string
  networks: Network[] // These networks are already filtered by allowedNetworks
  addresses: Array<{
    id: string
    address: string
    memo?: string | null
    network: {
      chain: string
      chainFullName: string
    }
  }>
}

export function DepositWalletDetails({ walletId, networks, addresses }: DepositWalletDetailsProps) {
  // Initialize with first allowed network
  const [activeNetwork, setActiveNetwork] = useState<string>(
    networks[0]?.chain || ""
  )
  const [processingNetworks, setProcessingNetworks] = useState<Set<string>>(new Set())

  // Remove the old useEffect since we're setting the initial value directly
  // This effect will only run if the networks change
  useEffect(() => {
    if (networks.length > 0 && !networks.some(n => n.chain === activeNetwork)) {
      setActiveNetwork(networks[0].chain)
    }
  }, [networks, activeNetwork])

  const handleGenerateAddress = async (networkId: string) => {
    try {
      setProcessingNetworks(prev => new Set(prev).add(networkId))
      await generateWalletAddress(walletId, networkId)
    } catch (error) {
      console.error("Failed to generate address:", error)
    } finally {
      setProcessingNetworks(prev => {
        const newSet = new Set(prev)
        newSet.delete(networkId)
        return newSet
      })
    }
  }

  const activeAddress = addresses.find(
    addr => addr.network.chain === activeNetwork
  )

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <Tabs 
          defaultValue={networks[0]?.chain || ""} 
          value={activeNetwork}
          onValueChange={setActiveNetwork}
        >
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {networks.map(network => (
              <TabsTrigger 
                key={network.chain} 
                value={network.chain}
                className="text-xs sm:text-sm"
              >
                {network.chainFullName}
              </TabsTrigger>
            ))}
          </TabsList>

          {networks.map(network => (
            <TabsContent key={network.chain} value={network.chain} className="space-y-4 mt-4">
              {activeAddress ? (
                <div className="space-y-4">
                  <div className="flex justify-center bg-white p-4 rounded-lg">
                    <QRCode 
                      value={activeAddress.address}
                      size={180}
                      level="H"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {network.chainFullName} Address
                      </span>
                      <CopyButton value={activeAddress.address} />
                    </div>
                    <div className="p-2.5 bg-muted rounded-md text-sm break-all">
                      {activeAddress.address}
                    </div>
                  </div>

                  {activeAddress.memo && (
                    <>
                      <Alert variant="warning" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Memo is required for this deposit. Missing memo will result in lost funds.
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Memo</span>
                          <CopyButton value={activeAddress.memo} />
                        </div>
                        <div className="p-2.5 bg-muted rounded-md text-sm break-all">
                          {activeAddress.memo}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => handleGenerateAddress(network.id)}
                  disabled={processingNetworks.has(network.id)}
                  className="w-full"
                >
                  {processingNetworks.has(network.id) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate {network.chainFullName} Address
                </Button>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}