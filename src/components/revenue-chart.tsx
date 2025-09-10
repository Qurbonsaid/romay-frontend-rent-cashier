'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { cn } from '@/lib/utils'

const data = [
  { name: 'Jan', total: 2000 },
  { name: 'Feb', total: 5000 },
  { name: 'Mar', total: 3000 },
  { name: 'Apr', total: 4000 },
  { name: 'May', total: 2000 },
  { name: 'Jun', total: 3200 },
  { name: 'Jul', total: 2000 },
  { name: 'Aug', total: 5000 },
  { name: 'Sep', total: 4000 },
  { name: 'Oct', total: 2000 },
  { name: 'Nov', total: 3200 },
  { name: 'Dec', total: 2000 },
]

const chartConfig = {
  total: {
    label: 'Total',
    color: '#4f46e5',
  },
} as const

export function RevenueChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Sotuv Statistikasi
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full pl-0 ml-0">
        <div className="w-full mt-10">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 0,
              }}
              barSize={30}
              className={cn(
                '[&_.recharts-cartesian-axis-tick]:text-[10px]',
                '[&_.recharts-bar]:w-full'
              )}
            >
              <XAxis
                dataKey="name"
                stroke="#71717A"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval={0}
              />
              <YAxis
                stroke="#71717A"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval={0}
                tickFormatter={(value: number) => `$${value}`}
              />
              <Bar
                dataKey="total"
                fill="currentColor"
                radius={4}
                maxBarSize={20}
                className="fill-primary"
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
