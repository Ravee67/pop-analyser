import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  testId?: string;
}

export function StatCard({ title, value, icon: Icon, testId }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold font-mono" data-testid={testId}>
            {value}
          </p>
        </div>
        <div className="text-muted-foreground/40">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}
