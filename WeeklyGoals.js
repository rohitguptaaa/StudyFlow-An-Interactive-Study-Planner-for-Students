import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WeeklyGoals({ goals, isLoading }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="w-5 h-5 text-orange-600" />
          Study Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-6">
            <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">No goals set yet</p>
            <button className="text-xs text-blue-600 hover:text-blue-800">
              Create your first goal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm text-gray-900">{goal.title}</h4>
                  <span className="text-xs text-gray-500">{goal.current_progress}%</span>
                </div>
                <Progress value={goal.current_progress} className="h-2" />
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3" />
                  <span>{goal.target_hours_weekly}h/week target</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}