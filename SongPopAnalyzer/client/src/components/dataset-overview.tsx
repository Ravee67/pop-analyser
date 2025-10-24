import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatasetSummary, CSVDataRow } from "@shared/schema";

interface DatasetOverviewProps {
  summary: DatasetSummary;
}

export function DatasetOverview({ summary }: DatasetOverviewProps) {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Dataset Preview</h3>
      <ScrollArea className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0">
              <TableRow>
                {summary.columns.map((column) => (
                  <TableHead key={column} className="font-semibold text-sm whitespace-nowrap">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.sampleData.map((row, index) => (
                <TableRow key={index} data-testid={`row-preview-${index}`}>
                  {summary.columns.map((column) => (
                    <TableCell 
                      key={column} 
                      className={`px-4 py-2 ${
                        typeof row[column] === 'number' ? 'font-mono text-sm' : ''
                      }`}
                    >
                      {row[column] !== null && row[column] !== undefined 
                        ? String(row[column]) 
                        : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      <p className="text-xs text-muted-foreground text-center">
        Showing first {summary.sampleData.length} rows
      </p>
    </Card>
  );
}
