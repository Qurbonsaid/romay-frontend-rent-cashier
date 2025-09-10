import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface BarChartData {
  name: string
  value: number
}

interface BarChartProps {
  data: BarChartData[]
  xAxisLabel?: string
  yAxisLabel?: string
  barColor?: string
}

export function CustomBarChart({
  data,
  xAxisLabel = 'Months',
  yAxisLabel = 'Amount ($)',
  barColor = '#8884d8',
}: BarChartProps) {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{ value: xAxisLabel, position: 'bottom', offset: 30 }}
          />
          <YAxis
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value) => [`$${value}`, 'Amount']}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Bar dataKey="value" fill={barColor} name="Amount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
