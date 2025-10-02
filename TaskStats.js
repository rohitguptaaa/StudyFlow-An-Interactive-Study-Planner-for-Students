import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, Clock, AlertCircle, Target,
  TrendingUp, Calendar
} from "lucide-react";

export default function TaskStats({ tasks, isLoading }) {
  const getStats = () => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const overdue = tasks.filter(t => {
      const due = new Date(t.due_date);
      const today = new Date();
      return t.status !== 'completed' && due < today;
    }).length;
    
    const totalHours = tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);
    
    return { completed, inProgress, overdue, totalHours, total: tasks.length };
  };

  const stats = getStats();

  const statItems = [
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      label: "In Progress", 
      value: stats.inProgress,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      color: "text-red-600", 
      bg: "bg-red-100"
    },
    {
      label: "Total Hours",
      value: `${stats.totalHours}h`,
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statItems.map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}