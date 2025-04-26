"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

type Currency = {
  code: string
  symbol: string
  name: string
  locale: string
}

const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
  { code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA" },
]

const defaultCurrency = currencies[0] // USD

type CurrencyContextType = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatCurrency: (value: number) => string
  currencies: Currency[]
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency)

  // Clear any saved currency settings and use USD as default
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("selectedCurrency")
    }
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency, currencies }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
} 