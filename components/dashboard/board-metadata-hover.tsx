import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Calendar, Globe, Lock, Clock, Eye, EyeClosed } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Board } from '@/actions/dashboard/kanban/boards';

interface BoardMetadataHoverProps {
  board: Board | null;
  children: React.ReactNode;
}

export function BoardMetadataHover({
  board,
  children,
}: BoardMetadataHoverProps) {
  if (!board) return <>{children}</>;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">{board.name}</h4>
            {board.visibility === 'public' ? (
              <Globe className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm">{board.description}</p>

            <div className="flex items-center text-sm text-muted-foreground">
              {board.visibility === 'public' ? (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Public board</span>
                </>
              ) : (
                <>
                  <EyeClosed className="mr-2 h-4 w-4" />
                  <span>Private board</span>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  Created {formatDistanceToNow(new Date(board.created_at))} ago
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>
                  Updated {formatDistanceToNow(new Date(board.last_updated))}{' '}
                  ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
