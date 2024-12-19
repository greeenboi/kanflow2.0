import { Card } from '@/components/ui/card';

interface KanbanColumnProps {
  column: {
    id: number;
    title: string;
    taskIds: number[];
  };
  children: React.ReactNode;
}

export function KanbanColumn({ column, children }: KanbanColumnProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{column.title}</h3>
      <Card className="p-4 space-y-4 min-h-[500px] bg-secondary/50">
        {children}
      </Card>
    </div>
  );
}
