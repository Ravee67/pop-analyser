import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import Papa from "papaparse";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { computeAnalysis } from "./analytics";
import { CSVDataRow, UploadedDataset } from "@shared/schema";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      let fileContent = req.file.buffer.toString('utf-8');
      
      if (fileContent.charCodeAt(0) === 0xFEFF) {
        fileContent = fileContent.substring(1);
      }
      
      console.log('File size:', req.file.size);
      console.log('First 200 chars:', fileContent.substring(0, 200));
      
      const parseResult = Papa.parse<CSVDataRow>(fileContent, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        delimiter: ',',
      });

      if (parseResult.errors.length > 0) {
        const error = parseResult.errors[0];
        return res.status(400).json({ 
          error: `CSV parsing error: ${error.message}` 
        });
      }

      const data = parseResult.data;
      const columns = parseResult.meta.fields || [];

      if (data.length === 0) {
        return res.status(400).json({ error: 'CSV file is empty' });
      }

      if (columns.length === 0) {
        return res.status(400).json({ error: 'CSV file has no columns' });
      }

      const id = randomUUID();
      const dataset: UploadedDataset = {
        id,
        filename: req.file.originalname,
        uploadedAt: new Date(),
        rowCount: data.length,
        columnCount: columns.length,
        columns,
        data,
      };

      await storage.saveDataset(dataset);

      const analysis = computeAnalysis(data, columns);
      await storage.saveAnalysis(id, analysis);

      res.json({
        id,
        message: `Successfully analyzed ${data.length} rows with ${columns.length} columns`,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to process file' 
      });
    }
  });

  app.get('/api/analysis/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const analysis = await storage.getAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found' });
      }

      res.json(analysis);
    } catch (error: any) {
      console.error('Analysis retrieval error:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to retrieve analysis' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
