import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Database, Columns3, Upload as UploadIcon, FileText, Music } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { DatasetOverview } from "@/components/dataset-overview";
import { PopularityDistributionChart } from "@/components/popularity-distribution";
import { TopSongsChart } from "@/components/top-songs-chart";
import { CorrelationHeatmap } from "@/components/correlation-heatmap";
import { YearlyTrendsChart } from "@/components/yearly-trends-chart";
import { GenreRankingsChart } from "@/components/genre-rankings-chart";
import { AnalysisResult } from "@shared/schema";

export default function Dashboard() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: analysis, isLoading, error } = useQuery<AnalysisResult>({
    queryKey: ['/api/analysis', id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setLocation('/')}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Music className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold">Spotify Analytics</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>

          <Skeleton className="h-96" />
        </main>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setLocation('/')}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Music className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold">Spotify Analytics</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Analysis Not Found</h1>
            <p className="text-muted-foreground">
              The requested analysis could not be found or has expired.
            </p>
            <Button onClick={() => setLocation('/')} data-testid="button-new-analysis">
              Upload New Dataset
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const { summary, popularityDistribution, topSongs, correlationMatrix, yearlyTrends, genreRankings } = analysis;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLocation('/')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Music className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold">Spotify Analytics</span>
            </div>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" data-testid="button-new-upload">
            <UploadIcon className="w-4 h-4 mr-2" />
            New Upload
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Analysis Results</h1>
          <p className="text-muted-foreground">
            Interactive visualizations and insights from your music dataset
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Dataset Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Rows"
              value={summary.rowCount.toLocaleString()}
              icon={Database}
              testId="stat-rows"
            />
            <StatCard
              title="Total Columns"
              value={summary.columnCount}
              icon={Columns3}
              testId="stat-columns"
            />
            <StatCard
              title="Numeric Features"
              value={summary.numericColumns.length}
              icon={FileText}
              testId="stat-numeric"
            />
            <StatCard
              title="Sample Size"
              value={summary.sampleData.length}
              icon={Database}
              testId="stat-sample"
            />
          </div>
          <DatasetOverview summary={summary} />
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Visualizations</h2>
          
          <PopularityDistributionChart data={popularityDistribution} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopSongsChart data={topSongs} />
            <CorrelationHeatmap data={correlationMatrix} />
          </div>

          <YearlyTrendsChart data={yearlyTrends} />

          <GenreRankingsChart data={genreRankings} />
        </section>
      </main>
    </div>
  );
}
