import { useId } from 'react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

interface VoltageChartProps {
  data: number[]
  color?: string
}

export const VoltageChart = ({ data, color = '#e63946' }: VoltageChartProps) => {

  const gradientId = useId()
  const chartData = data.map((value, index) => ({ index, value }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 4 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.08} />
          </linearGradient>
        </defs>
        <Area
          type="linear"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          isAnimationActive={false}
          dot={false}
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}