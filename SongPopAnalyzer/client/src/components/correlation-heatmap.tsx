import { ChartCard } from "./chart-card";
import { CorrelationData } from "@shared/schema";

interface CorrelationHeatmapProps {
  data: CorrelationData[];
}

export function CorrelationHeatmap({ data }: CorrelationHeatmapProps) {
  if (data.length === 0) {
    return (
      <ChartCard title="Feature Correlation Heatmap" chartId="correlation-heatmap">
        <div className="flex items-center justify-center h-80 text-muted-foreground">
          No correlation data available
        </div>
      </ChartCard>
    );
  }

  const features = Array.from(new Set([
    ...data.map(d => d.feature1),
    ...data.map(d => d.feature2)
  ])).sort();

  const getCorrelation = (f1: string, f2: string): number => {
    if (f1 === f2) return 1;
    const corr = data.find(
      d => (d.feature1 === f1 && d.feature2 === f2) || 
           (d.feature1 === f2 && d.feature2 === f1)
    );
    return corr?.correlation || 0;
  };

  const getColor = (correlation: number): string => {
    const intensity = Math.abs(correlation);
    if (correlation > 0) {
      const lightness = 100 - (intensity * 30);
      return `hsl(142, 76%, ${lightness}%)`;
    } else {
      const lightness = 100 - (intensity * 30);
      return `hsl(0, 84%, ${lightness}%)`;
    }
  };

  return (
    <ChartCard title="Feature Correlation Heatmap" chartId="correlation-heatmap">
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${features.length}, 1fr)` }}>
          <div></div>
          {features.map(feature => (
            <div 
              key={`header-${feature}`}
              className="text-xs font-medium text-center transform -rotate-45 origin-left mb-8"
              style={{ width: '60px' }}
            >
              {feature}
            </div>
          ))}
          
          {features.map((feature1, i) => (
            <>
              <div 
                key={`label-${feature1}`}
                className="text-xs font-medium text-right pr-2 flex items-center justify-end"
                style={{ width: '100px' }}
              >
                {feature1}
              </div>
              {features.map((feature2, j) => {
                const correlation = getCorrelation(feature1, feature2);
                return (
                  <div
                    key={`cell-${i}-${j}`}
                    className="w-14 h-14 flex items-center justify-center rounded text-xs font-mono font-semibold border border-border"
                    style={{ 
                      backgroundColor: getColor(correlation),
                      color: Math.abs(correlation) > 0.5 ? '#ffffff' : '#000000'
                    }}
                    data-testid={`correlation-${feature1}-${feature2}`}
                  >
                    {correlation.toFixed(2)}
                  </div>
                );
              })}
            </>
          ))}
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(142, 76%, 70%)' }}></div>
            <span>Positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(0, 84%, 70%)' }}></div>
            <span>Negative</span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
