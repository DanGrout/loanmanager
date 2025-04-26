"use client"

import dynamic from "next/dynamic"
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export const BarChart = ({ data, index, categories, colors, valueFormatter, className }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} className={className}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis tickFormatter={valueFormatter} />
        <Tooltip formatter={(value: number) => (valueFormatter ? [valueFormatter(value)] : [value])} />
        <Legend />
        {categories.map((category, i) => (
          <Bar key={category} dataKey={category} fill={colors[i % colors.length]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export const LineChart = ({ data, index, categories, colors, valueFormatter, className }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} className={className}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis tickFormatter={valueFormatter} />
        <Tooltip formatter={(value: number) => (valueFormatter ? [valueFormatter(value)] : [value])} />
        <Legend />
        {categories.map((category, i) => (
          <Line key={category} type="monotone" dataKey={category} stroke={colors[i % colors.length]} />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export const PieChart = ({ data, index, categories, colors, valueFormatter, className }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart className={className}>
        <Pie data={data} dataKey={categories[0]} nameKey={index} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number, name: string) => (valueFormatter ? [valueFormatter(value), name] : [value, name])} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
} 