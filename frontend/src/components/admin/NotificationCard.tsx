import { Bell, Calendar, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "appointment" | "review" | "order";
  title: string;
  message: string;
  time: string;
  isNew: boolean;
}

interface NotificationCardProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

export function NotificationCard({ notification, onDismiss }: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "appointment":
        return <Calendar className="w-4 h-4 text-primary" />;
      case "review":
        return <User className="w-4 h-4 text-info" />;
      case "order":
        return <Bell className="w-4 h-4 text-success" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case "appointment":
        return "border-l-primary";
      case "review":
        return "border-l-info";
      case "order":
        return "border-l-success";
    }
  };

  return (
    <Card className={`border-l-4 ${getBorderColor()} ${notification.isNew ? 'bg-accent/10' : ''} transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              {getIcon()}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm text-foreground">{notification.title}</h4>
                {notification.isNew && (
                  <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
                    New
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{notification.time}</span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDismiss(notification.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}