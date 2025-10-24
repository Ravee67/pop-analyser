import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, X, Music } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0]);
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error?.message || "Invalid file format. Please upload a CSV file.",
      });
    },
  });

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await apiRequest<{ id: string; message: string }>(
        'POST',
        '/api/upload',
        formData
      );

      toast({
        title: "Upload successful",
        description: response.message,
      });

      setLocation(`/dashboard/${response.id}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload file. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold">Spotify Analytics</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            Analyze Your Music Data
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload any music CSV and get instant insights into popularity trends, top songs, correlations, and genre analytics
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <div
            {...getRootProps()}
            className={`
              min-h-64 rounded-lg border-2 border-dashed p-8
              flex flex-col items-center justify-center gap-4
              transition-colors cursor-pointer
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : uploadedFile 
                  ? 'border-border bg-card' 
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50'
              }
            `}
            data-testid="dropzone-upload"
          >
            <input {...getInputProps()} />
            
            {uploadedFile ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <FileText className="w-12 h-12 text-primary" />
                <div className="text-center space-y-2 flex-1">
                  <p className="font-medium text-lg">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                  }}
                  data-testid="button-remove-file"
                  className="absolute top-4 right-4"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-muted-foreground" />
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">
                    {isDragActive 
                      ? 'Drop your CSV file here' 
                      : 'Drag and drop your CSV file here'
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse • Maximum 10MB • .csv format
                  </p>
                </div>
              </>
            )}
          </div>

          {uploadedFile && (
            <div className="flex justify-center">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                size="lg"
                className="px-8"
                data-testid="button-analyze"
              >
                {isUploading ? 'Analyzing...' : 'Analyze Dataset'}
              </Button>
            </div>
          )}
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Your data stays private and secure. We process everything in-memory.
          </p>
        </div>
      </main>
    </div>
  );
}
