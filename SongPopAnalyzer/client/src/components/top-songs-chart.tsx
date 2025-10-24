import { ChartCard } from "./chart-card";
import { TopSong } from "@shared/schema";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TopSongsChartProps {
  data: TopSong[];
}

export function TopSongsChart({ data }: TopSongsChartProps) {
  const chartData = data.map(song => ({
    ...song,
    displayName: song.name.length > 30 ? song.name.substring(0, 30) + '...' : song.name,
  }));

  return (
    <ChartCard title="Top 10 Songs by Popularity" chartId="top-songs">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-80 text-muted-foreground">
          No song data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="vertical"
            margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
              label={{ value: 'Popularity Score', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="category"
              dataKey="displayName"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 11 }}
              width={110}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-lg)',
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              formatter={(value: number, name: string, props: any) => [
                value,
                props.payload.name
              ]}
            />
            <Bar dataKey="popularity" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
