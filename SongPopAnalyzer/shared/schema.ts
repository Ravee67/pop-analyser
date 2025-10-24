import { z } from "zod";

export const csvDataRowSchema = z.record(z.string(), z.union([z.string(), z.number(), z.null()]));

export type CSVDataRow = z.infer<typeof csvDataRowSchema>;

export interface UploadedDataset {
  id: string;
  filename: string;
  uploadedAt: Date;
  rowCount: number;
  columnCount: number;
  columns: string[];
  data: CSVDataRow[];
}

export interface DatasetSummary {
  rowCount: number;
  columnCount: number;
  columns: string[];
  sampleData: CSVDataRow[];
  numericColumns: string[];
}

export interface PopularityDistribution {
  range: string;
  count: number;
}

export interface TopSong {
  rank: number;
  name: string;
  artist?: string;
  popularity: number;
}

export interface CorrelationData {
  feature1: string;
  feature2: string;
  correlation: number;
}

export interface YearlyTrend {
  year: number;
  averagePopularity: number;
  songCount: number;
}

export interface GenreRanking {
  genre: string;
  averagePopularity: number;
  songCount: number;
}

export interface AnalysisResult {
  summary: DatasetSummary;
  popularityDistribution: PopularityDistribution[];
  topSongs: TopSong[];
  correlationMatrix: CorrelationData[];
  yearlyTrends: YearlyTrend[];
  genreRankings: GenreRanking[];
}

export const uploadResponseSchema = z.object({
  id: z.string(),
  message: z.string(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
