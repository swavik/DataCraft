import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAction } from "@/hooks/useUserProfile";
import { Upload, Sparkles, Eye, Download, Trash2, Clock } from "lucide-react";

interface UserActivityTimelineProps {
  actions: UserAction[];
}

const getActionIcon = (type: UserAction['type']) => {
  switch (type) {
    case 'upload':
      return Upload;
    case 'generate':
      return Sparkles;
    case 'view':
      return Eye;
    case 'download':
      return Download;
    case 'delete':
      return Trash2;
    default:
      return Clock;
  }
};

const getActionColor = (type: UserAction['type']) => {
  switch (type) {
    case 'upload':
      return 'text-blue-500 bg-blue-500/10';
    case 'generate':
      return 'text-primary bg-primary/10';
    case 'view':
      return 'text-green-500 bg-green-500/10';
    case 'download':
      return 'text-purple-500 bg-purple-500/10';
    case 'delete':
      return 'text-destructive bg-destructive/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const actionTime = new Date(timestamp);
  const diffInMs = now.getTime() - actionTime.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return actionTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function UserActivityTimeline({ actions }: UserActivityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest actions and activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {actions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No activity yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start by uploading a dataset</p>
            </div>
          ) : (
            <div className="space-y-4">
              {actions.map((action, index) => {
                const Icon = getActionIcon(action.type);
                const colorClass = getActionColor(action.type);
                
                return (
                  <div key={action.id} className="flex gap-3 items-start">
                    <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{action.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(action.timestamp)}</p>
                    </div>
                    {index < actions.length - 1 && (
                      <div className="absolute left-8 top-12 w-px h-8 bg-border" style={{ marginLeft: '-0.75rem' }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
