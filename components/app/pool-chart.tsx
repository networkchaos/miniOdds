'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartProps {
  data: Array<{
    time: string
    odds: number[]
  }>
  outcomes: Array<{
    id: string
    label: string
  }>
}

export default function PoolChart({ data, outcomes }: ChartProps) {
  const colors = ['#9333ea', '#3b82f6', '#10b981']

  const chartData = data.map((d) => ({
    time: d.time,
    ...Object.fromEntries(
      d.odds.map((odd, i) => [`${outcomes[i].label}`, odd])
    ),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
        <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#fff' }}
        />
        {outcomes.map((outcome, i) => (
          <Line
            key={outcome.id}
            type="monotone"
            dataKey={outcome.label}
            stroke={colors[i]}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
