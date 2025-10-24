import {
  CSVDataRow,
  DatasetSummary,
  PopularityDistribution,
  TopSong,
  CorrelationData,
  YearlyTrend,
  GenreRanking,
  AnalysisResult,
} from "@shared/schema";

export function computeAnalysis(
  data: CSVDataRow[],
  columns: string[]
): AnalysisResult {
  const numericColumns = detectNumericColumns(data, columns);
  const summary = createSummary(data, columns, numericColumns);
  
  const popularityColumn = findPopularityColumn(columns);
  const songNameColumn = findSongNameColumn(columns);
  const artistColumn = findArtistColumn(columns);
  const genreColumn = findGenreColumn(columns);
  const yearColumn = findYearColumn(columns);

  const popularityDistribution = computePopularityDistribution(data, popularityColumn);
  const topSongs = computeTopSongs(data, popularityColumn, songNameColumn, artistColumn);
  const correlationMatrix = computeCorrelationMatrix(data, numericColumns);
  const yearlyTrends = computeYearlyTrends(data, popularityColumn, yearColumn);
  const genreRankings = computeGenreRankings(data, popularityColumn, genreColumn);

  return {
    summary,
    popularityDistribution,
    topSongs,
    correlationMatrix,
    yearlyTrends,
    genreRankings,
  };
}

function detectNumericColumns(data: CSVDataRow[], columns: string[]): string[] {
  return columns.filter(column => {
    const values = data.slice(0, 100).map(row => row[column]);
    const numericCount = values.filter(v => 
      v !== null && v !== undefined && v !== '' && !isNaN(Number(v))
    ).length;
    return numericCount / values.length > 0.8;
  });
}

function createSummary(
  data: CSVDataRow[],
  columns: string[],
  numericColumns: string[]
): DatasetSummary {
  return {
    rowCount: data.length,
    columnCount: columns.length,
    columns,
    sampleData: data.slice(0, 10),
    numericColumns,
  };
}

function findPopularityColumn(columns: string[]): string | null {
  const popularityKeywords = ['popularity', 'popular', 'score', 'rating'];
  return columns.find(col => 
    popularityKeywords.some(keyword => col.toLowerCase().includes(keyword))
  ) || null;
}

function findSongNameColumn(columns: string[]): string | null {
  const nameKeywords = ['track', 'song', 'title', 'name'];
  return columns.find(col => 
    nameKeywords.some(keyword => col.toLowerCase().includes(keyword))
  ) || columns[0];
}

function findArtistColumn(columns: string[]): string | null {
  const artistKeywords = ['artist', 'performer', 'musician'];
  return columns.find(col => 
    artistKeywords.some(keyword => col.toLowerCase().includes(keyword))
  ) || null;
}

function findGenreColumn(columns: string[]): string | null {
  const genreKeywords = ['genre', 'category', 'type', 'style'];
  return columns.find(col => 
    genreKeywords.some(keyword => col.toLowerCase().includes(keyword))
  ) || null;
}

function findYearColumn(columns: string[]): string | null {
  const yearKeywords = ['year', 'date', 'release'];
  return columns.find(col => 
    yearKeywords.some(keyword => col.toLowerCase().includes(keyword))
  ) || null;
}

function computePopularityDistribution(
  data: CSVDataRow[],
  popularityColumn: string | null
): PopularityDistribution[] {
  if (!popularityColumn) return [];

  const ranges = [
    { min: 0, max: 20, label: '0-20' },
    { min: 20, max: 40, label: '20-40' },
    { min: 40, max: 60, label: '40-60' },
    { min: 60, max: 80, label: '60-80' },
    { min: 80, max: 101, label: '80-100' },
  ];

  const distribution = ranges.map(range => ({
    range: range.label,
    count: 0,
  }));

  data.forEach(row => {
    const popularity = Number(row[popularityColumn]);
    if (!isNaN(popularity)) {
      const rangeIndex = ranges.findIndex(r => popularity >= r.min && popularity < r.max);
      if (rangeIndex !== -1) {
        distribution[rangeIndex].count++;
      }
    }
  });

  return distribution;
}

function computeTopSongs(
  data: CSVDataRow[],
  popularityColumn: string | null,
  songNameColumn: string | null,
  artistColumn: string | null
): TopSong[] {
  if (!popularityColumn || !songNameColumn) return [];

  const songs = data
    .map(row => ({
      name: String(row[songNameColumn] || 'Unknown'),
      artist: artistColumn ? String(row[artistColumn] || '') : undefined,
      popularity: Number(row[popularityColumn]) || 0,
    }))
    .filter(song => !isNaN(song.popularity) && song.popularity > 0)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10)
    .map((song, index) => ({
      rank: index + 1,
      ...song,
    }));

  return songs;
}

function computeCorrelationMatrix(
  data: CSVDataRow[],
  numericColumns: string[]
): CorrelationData[] {
  const targetColumns = numericColumns.filter(col => 
    ['popularity', 'danceability', 'energy', 'acousticness', 'valence', 'tempo']
      .some(keyword => col.toLowerCase().includes(keyword))
  ).slice(0, 5);

  if (targetColumns.length < 2) return [];

  const correlations: CorrelationData[] = [];

  for (let i = 0; i < targetColumns.length; i++) {
    for (let j = i + 1; j < targetColumns.length; j++) {
      const col1 = targetColumns[i];
      const col2 = targetColumns[j];
      const correlation = calculateCorrelation(data, col1, col2);
      
      correlations.push({
        feature1: col1,
        feature2: col2,
        correlation,
      });
    }
  }

  return correlations;
}

function calculateCorrelation(
  data: CSVDataRow[],
  col1: string,
  col2: string
): number {
  const pairs = data
    .map(row => ({
      x: Number(row[col1]),
      y: Number(row[col2]),
    }))
    .filter(pair => !isNaN(pair.x) && !isNaN(pair.y));

  if (pairs.length < 2) return 0;

  const n = pairs.length;
  const sumX = pairs.reduce((sum, p) => sum + p.x, 0);
  const sumY = pairs.reduce((sum, p) => sum + p.y, 0);
  const sumXY = pairs.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = pairs.reduce((sum, p) => sum + p.x * p.x, 0);
  const sumY2 = pairs.reduce((sum, p) => sum + p.y * p.y, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  );

  return denominator === 0 ? 0 : numerator / denominator;
}

function computeYearlyTrends(
  data: CSVDataRow[],
  popularityColumn: string | null,
  yearColumn: string | null
): YearlyTrend[] {
  if (!popularityColumn || !yearColumn) return [];

  const yearData = new Map<number, { total: number; count: number }>();

  data.forEach(row => {
    const yearValue = row[yearColumn];
    let year: number | null = null;

    if (typeof yearValue === 'number') {
      year = yearValue;
    } else if (typeof yearValue === 'string') {
      const yearMatch = yearValue.match(/\d{4}/);
      if (yearMatch) {
        year = parseInt(yearMatch[0]);
      }
    }

    const popularity = Number(row[popularityColumn]);

    if (year && !isNaN(popularity) && year >= 1900 && year <= 2030) {
      const existing = yearData.get(year) || { total: 0, count: 0 };
      yearData.set(year, {
        total: existing.total + popularity,
        count: existing.count + 1,
      });
    }
  });

  const trends = Array.from(yearData.entries())
    .map(([year, stats]) => ({
      year,
      averagePopularity: stats.total / stats.count,
      songCount: stats.count,
    }))
    .sort((a, b) => a.year - b.year);

  return trends;
}

function computeGenreRankings(
  data: CSVDataRow[],
  popularityColumn: string | null,
  genreColumn: string | null
): GenreRanking[] {
  if (!popularityColumn || !genreColumn) return [];

  const genreData = new Map<string, { total: number; count: number }>();

  data.forEach(row => {
    const genre = String(row[genreColumn] || '').trim();
    const popularity = Number(row[popularityColumn]);

    if (genre && !isNaN(popularity)) {
      const existing = genreData.get(genre) || { total: 0, count: 0 };
      genreData.set(genre, {
        total: existing.total + popularity,
        count: existing.count + 1,
      });
    }
  });

  const rankings = Array.from(genreData.entries())
    .map(([genre, stats]) => ({
      genre,
      averagePopularity: stats.total / stats.count,
      songCount: stats.count,
    }))
    .sort((a, b) => b.averagePopularity - a.averagePopularity)
    .slice(0, 10);

  return rankings;
}
