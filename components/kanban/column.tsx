import { Card } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext } from '@dnd-kit/sortable';
import clsx from 'clsx';
import type { UniqueIdentifier } from '@dnd-kit/core';

interface KanbanColumnProps {
  id: UniqueIdentifier;
  title: string;
  children: React.ReactNode;
  onAddItem: () => void;
  isDragging?: boolean;
}

export function KanbanColumn({ id, title, children, onAddItem, isDragging }: KanbanColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortingDragging,
  } = useSortable({
    id,
    data: {
      type: 'container',
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Transform.toString(transform),
      }}
      className={clsx(
        'w-full h-full p-4 bg-secondary/50 rounded-xl flex flex-col gap-y-4',
        isSortingDragging && 'opacity-50',
        isDragging && 'border-2 border-dashed border-blue-500'
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        <button
          className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
          {...listeners}
        >
          Drag Handle
        </button>
      </div>
      <SortableContext items={children ? [] : []}>
        {children}
      </SortableContext>
    </div>
  );
}
