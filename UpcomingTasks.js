import React from 'react';
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudyTask } from "@/entities/StudyTask";
import { 
  BookOpen, Calendar, AlertCircle, CheckCircle2,
  Clock, TrendingUp
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  high: "bg-orange-100 text-orange-800 border-orange-200",
  urgent: "bg-red-100 text-red-800 border-red-200"
};

const categoryIcons = {
  assignment: BookOpen,
  exam: AlertCircle,
  reading: BookOpen,
  project: TrendingUp,
  revision: Clock,
  other: BookOpen
};

export default function UpcomingTasks({ tasks, isLoading, onTaskUpdate }) {
  const handleCompleteTask = async (taskId) => {
    try {
      await StudyTask.update(taskId, { status: 'completed' });
      onTaskUpdate();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="w-5 h-5 text-blue-600" />
          Upcoming Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500">All caught up! No upcoming tasks.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tasks.map((task) => {
              const CategoryIcon = categoryIcons[task.category] || BookOpen;
              const daysUntil = getDaysUntilDue(task.due_date);
              
              return (
                <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CategoryIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{task.subject}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          variant="outline" 
                          className={`${priorityColors[task.priority]} text-xs`}
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Due {format(new Date(task.due_date), "MMM d")}
                        </span>
                        {daysUntil <= 2 && (
                          <Badge variant="destructive" className="text-xs">
                            {daysUntil === 0 ? "Due today" : `${daysUntil} days left`}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleCompleteTask(task.id)}
                      className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}