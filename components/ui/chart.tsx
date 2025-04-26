"use client"

import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts"
import dynamic from "next/dynamic"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export const BarChart = dynamic(() => import("./charts").then((mod) => mod.BarChart), {
  ssr: false,
})

export const LineChart = dynamic(() => import("./charts").then((mod) => mod.LineChart), {
  ssr: false,
})

export const PieChart = dynamic(() => import("./charts").then((mod) => mod.PieChart), {
  ssr: false,
})
