export interface Transaction {
  id: string
  source: string
  amount: number
  currency: string
  type: string
  date: Date
}