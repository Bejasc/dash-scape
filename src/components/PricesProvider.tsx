import { createContext, useContext, type ReactNode } from 'react'
import { usePrices, type UsePrices } from '../hooks/usePrices'

const PricesContext = createContext<UsePrices | null>(null)

/** Single app-wide price fetch shared by every ItemLink/CostTable. */
export function PricesProvider({ children }: { children: ReactNode }) {
  const prices = usePrices()
  return <PricesContext.Provider value={prices}>{children}</PricesContext.Provider>
}

export function usePricesContext(): UsePrices | null {
  return useContext(PricesContext)
}
