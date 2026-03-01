'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Entry } from '@/types/entries';

interface FuelEconomyChartProps {
  entries: Entry[];
}

function formatDate(date: Date): string {
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${month}/${day}`;
}

function calculateFuelEconomy(entry: Entry): number | null {
  if (entry.fuelAmount <= 0) return null;
  return entry.distanceSinceLastRefuel / entry.fuelAmount;
}

export default function FuelEconomyChart({ entries }: FuelEconomyChartProps) {
  const data = entries
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((entry) => {
      const fuelEconomy = calculateFuelEconomy(entry);
      return {
        date: formatDate(new Date(entry.createdAt)),
        fuelEconomy: fuelEconomy ?? 0,
      };
    });

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-zinc-500">
        データがありません
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          angle={-45}
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
          height={60}
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="fuelEconomy"
          name="燃費 (km/L)"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
