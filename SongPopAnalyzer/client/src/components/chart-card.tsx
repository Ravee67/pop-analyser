import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Download } from "lucide-react";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  chartId: string;
}

export function ChartCard({ title, children, chartId }: ChartCardProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const exportAsPNG = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `${chartId}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Export successful",
        description: "Chart exported as PNG",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Failed to export chart. Please try again.",
      });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`button-menu-${chartId}`}>
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportAsPNG} data-testid={`button-export-${chartId}`}>
              <Download className="w-4 h-4 mr-2" />
              Export as PNG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div ref={chartRef} className="min-h-80">
        {children}
      </div>
    </Card>
  );
}
