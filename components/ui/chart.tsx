import { Bar, BarChart, Line, LineChart, Pie, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export const BarChartComponent = ({ data, index, categories, colors, valueFormatter, className }: ChartProps) => {
  return (
    <BarChart width={500} height={300} data={data} className={className}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={index} />
      <YAxis tickFormatter={valueFormatter} />
      <Tooltip formatter={(value) => (valueFormatter ? [valueFormatter(value)] : [value])} />
      <Legend />
      {categories.map((category, i) => (
        <Bar key={category} dataKey={category} fill={colors[i % colors.length]} />
      ))}
    </BarChart>
  )
}

export const LineChartComponent = ({ data, index, categories, colors, valueFormatter, className }: ChartProps) => {
  return (
    <LineChart width={500} height={300} data={data} className={className}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={index} />
      <YAxis tickFormatter={valueFormatter} />
      <Tooltip formatter={(value) => (valueFormatter ? [valueFormatter(value)] : [value])} />
      <Legend />
      {categories.map((category, i) => (
        <Line key={category} type="monotone" dataKey={category} stroke={colors[i % colors.length]} />
      ))}
    </LineChart>
  )
}

export const PieChartComponent = ({ data, index, categories, colors, valueFormatter, className }: ChartProps) => {
  return (
    <PieChart width={400} height={300} className={className}>
      <Pie data={data} dataKey={categories[0]} nameKey={index} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
        {data.map((entry, i) => (
          <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value, name) => (valueFormatter ? [valueFormatter(value), name] : [value, name])} />
      <Legend />
    </PieChart>
  )
}

import { Cell } from "recharts"

export { BarChartComponent as BarChart, LineChartComponent as LineChart, PieChartComponent as PieChart }
