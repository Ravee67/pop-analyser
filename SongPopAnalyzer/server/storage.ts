import { UploadedDataset, AnalysisResult } from "@shared/schema";

export interface IStorage {
  saveDataset(dataset: UploadedDataset): Promise<void>;
  getDataset(id: string): Promise<UploadedDataset | undefined>;
  saveAnalysis(id: string, analysis: AnalysisResult): Promise<void>;
  getAnalysis(id: string): Promise<AnalysisResult | undefined>;
}

export class MemStorage implements IStorage {
  private datasets: Map<string, UploadedDataset>;
  private analyses: Map<string, AnalysisResult>;

  constructor() {
    this.datasets = new Map();
    this.analyses = new Map();
  }

  async saveDataset(dataset: UploadedDataset): Promise<void> {
    this.datasets.set(dataset.id, dataset);
  }

  async getDataset(id: string): Promise<UploadedDataset | undefined> {
    return this.datasets.get(id);
  }

  async saveAnalysis(id: string, analysis: AnalysisResult): Promise<void> {
    this.analyses.set(id, analysis);
  }

  async getAnalysis(id: string): Promise<AnalysisResult | undefined> {
    return this.analyses.get(id);
  }
}

export const storage = new MemStorage();
