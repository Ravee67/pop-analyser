import { ChartCard } from "./chart-card";
import { GenreRanking } from "@shared/schema";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface GenreRankingsChartProps {
  data: GenreRanking[];
}

export function GenreRankingsChart({ data }: GenreRankingsChartProps) {
  return (
    <ChartCard title="Top 10 Genres by Average Popularity" chartId="genre-rankings">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-80 text-muted-foreground">
          No genre data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="genre" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 11, angle: -45, textAnchor: 'end' }}
              height={100}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
              label={{ value: 'Average Popularity', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-lg)',
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Bar dataKey="averagePopularity" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
              ))}
              <LabelList 
                dataKey="averagePopularity" 
                position="top" 
                formatter={(value: number) => value.toFixed(1)}
                style={{ fontSize: '11px', fill: 'hsl(var(--foreground))' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
