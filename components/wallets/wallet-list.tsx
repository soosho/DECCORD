"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Send, ImageOff, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useState, useEffect } from "react"
import { walletsConfig } from "@/lib/config"
import { WalletDetails } from "./wallet-details"
import Image from "next/image"
import { Wallet } from "@/types/wallet"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SendModal } from "./send-modal"

interface WalletNetwork {
  id: string
  chain: string
  chainFullName: string
  minimumDepositAmount: string
  minimumWithdrawAmount: string
  maximumWithdrawAmount: string
  canDeposit: boolean
  canWithdraw: boolean
  isSupportMemo: boolean
}

interface WalletAddress {
  id: string
  address: string
  memo?: string | null
  network: WalletNetwork
}

interface LocalWallet {
  id: string
  name: string
  symbol: string
  balance: string
  price: number
  addresses: WalletAddress[]
  coin: {
    api: string | null
    networks: WalletNetwork[]
    minimumDeposit: string
    minimumWithdraw: string
    withdrawFee: string
    coinStatus: string
    depositStatus: string
    withdrawStatus: string
    logoUrl: string  // Add this field
  }
}

// Helper function for balance formatting
function formatBalance(balance: string): string {
  const num = parseFloat(balance)
  const formatted = num.toFixed(8)
  return formatted.replace(/\.?0+$/, '')
}

// Helper function for USD value calculation
function getUsdValue(balance: string, price: number): number {
  return parseFloat(balance) * price
}

interface WalletListProps {
  wallets: Wallet[]
}

// Remove generate address related code and simplify the actions column
type SortField = 'price' | 'balance' | 'value'
type SortDirection = 'asc' | 'desc'

export function WalletList({ wallets: initialWallets }: { wallets: LocalWallet[] }) {
  // Change default value to true
  const [hideZeroBalance, setHideZeroBalance] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [selectedWalletForSend, setSelectedWalletForSend] = useState<LocalWallet | null>(null)
  
  // Update the useEffect to use true as default
  useEffect(() => {
    const saved = localStorage.getItem('hideZeroBalance')
    // If no saved preference, use true as default
    setHideZeroBalance(saved ? JSON.parse(saved) === true : true)
    setMounted(true)
  }, [])

  // Save preference when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('hideZeroBalance', JSON.stringify(hideZeroBalance))
    }
  }, [hideZeroBalance, mounted])

  // Update the handler to only update state
  const handleHideZeroBalanceChange = (checked: boolean) => {
    setHideZeroBalance(checked)
  }

  // Only render the switch if mounted
  const renderSwitch = () => {
    if (!mounted) {
      return null // or a placeholder/skeleton
    }

    return (
      <div className="flex items-center space-x-2">
        <Switch
          id="hide-zero"
          checked={hideZeroBalance}
          onCheckedChange={handleHideZeroBalanceChange}
        />
        <Label htmlFor="hide-zero" className="text-sm text-muted-foreground">
          Hide zero balances
        </Label>
      </div>
    )
  }

  // Other state declarations...
  const [wallets, setWallets] = useState(initialWallets)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedWallet, setSelectedWallet] = useState<LocalWallet | null>(null)
  const [sortField, setSortField] = useState<SortField>('value')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchQuery, setSearchQuery] = useState("")

  const handleWalletUpdate = (updatedWallet: LocalWallet) => {
    setWallets(prev => 
      prev.map(w => w.id === updatedWallet.id ? updatedWallet : w)
    )
    setSelectedWallet(updatedWallet)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, set it with default desc direction
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const filterWallets = (wallets: LocalWallet[]) => {
    let filtered = wallets

    // Filter zero balances if enabled
    if (hideZeroBalance) {
      filtered = filtered.filter(wallet => parseFloat(wallet.balance) > 0)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        wallet => 
          wallet.name.toLowerCase().includes(query) || 
          wallet.symbol.toLowerCase().includes(query)
      )
    }

    return filtered
  }

  if (!wallets.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Wallets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No wallets found. Add a wallet to get started.
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort wallets by USD value
  const sortedAndFilteredWallets = filterWallets([...wallets]).sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1
    
    // Add priority sorting for search matches
    if (searchQuery) {
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      const aSymbol = a.symbol.toLowerCase()
      const bSymbol = b.symbol.toLowerCase()
      const query = searchQuery.toLowerCase()

      // Check if name/symbol starts with search query
      const aStartsWith = aName.startsWith(query) || aSymbol.startsWith(query)
      const bStartsWith = bName.startsWith(query) || bSymbol.startsWith(query)

      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1
    }
    
    // Fall back to normal sorting if no search or equal priority
    switch (sortField) {
      case 'price':
        return (a.price - b.price) * modifier
      case 'balance':
        return (parseFloat(a.balance) - parseFloat(b.balance)) * modifier
      case 'value':
        return (getUsdValue(a.balance, a.price) - getUsdValue(b.balance, b.price)) * modifier
      default:
        return 0
    }
  })

  const totalPages = Math.ceil(sortedAndFilteredWallets.length / walletsConfig.itemsPerPage)
  const startIndex = (currentPage - 1) * walletsConfig.itemsPerPage
  const paginatedWallets = sortedAndFilteredWallets.slice(startIndex, startIndex + walletsConfig.itemsPerPage)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle>Your Wallets</CardTitle>
              {renderSwitch()}
            </div>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search wallets..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead className="hidden md:table-cell w-[150px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('price')}
                    className="flex items-center justify-between w-full h-8 p-0 font-semibold"
                  >
                    Price
                    {sortField === 'price' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="h-4 w-4 ml-2" />
                      ) : (
                        <ArrowDown className="h-4 w-4 ml-2" />
                      )
                    ) : (
                      <ArrowUpDown className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="w-[150px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('balance')}
                    className="flex items-center justify-between w-full h-8 p-0 font-semibold"
                  >
                    Balance
                    {sortField === 'balance' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="h-4 w-4 ml-2" />
                      ) : (
                        <ArrowDown className="h-4 w-4 ml-2" />
                      )
                    ) : (
                      <ArrowUpDown className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell w-[150px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('value')}
                    className="flex items-center justify-between w-full h-8 p-0 font-semibold"
                  >
                    Value (USD)
                    {sortField === 'value' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="h-4 w-4 ml-2" />
                      ) : (
                        <ArrowDown className="h-4 w-4 ml-2" />
                      )
                    ) : (
                      <ArrowUpDown className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedWallets.map((wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        {wallet.coin.logoUrl ? (
                          <Image
                            src={wallet.coin.logoUrl}
                            alt={`${wallet.symbol} icon`}
                            width={24}
                            height={24}
                            style={{ width: '24px', height: '24px' }}  // Fixed dimensions
                            className="object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                        ) : (
                          <ImageOff className="w-4 h-4 text-muted-foreground" />
                        )}
                        <ImageOff className="w-4 h-4 text-muted-foreground hidden absolute" />
                      </div>
                      <span>{wallet.name} ({wallet.symbol})</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                  ${wallet.price ? (wallet.price < 0.01 ? wallet.price.toFixed(8) : wallet.price.toFixed(2)) : "0.00"}
                  </TableCell>

                  <TableCell>{formatBalance(wallet.balance)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    ${getUsdValue(wallet.balance, wallet.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedWallet(wallet)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedWalletForSend(wallet)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
{totalPages > 1 && (
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </PaginationItem>
      
      {[...Array(totalPages)].map((_, i) => (
        <PaginationItem key={i + 1}>
          <Button
            variant="ghost"
            className={`h-8 w-8 p-0 ${currentPage === i + 1 ? 'bg-muted' : ''}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        </PaginationItem>
      ))}

      <PaginationItem>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
)}
        </CardContent>
      </Card>

      <WalletDetails
        isOpen={!!selectedWallet}
        onClose={() => setSelectedWallet(null)}
        wallet={selectedWallet}
        onWalletUpdate={handleWalletUpdate}
      />

      <SendModal
        isOpen={!!selectedWalletForSend}
        onClose={() => setSelectedWalletForSend(null)}
        wallet={selectedWalletForSend}
      />
    </>
  )
}