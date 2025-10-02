import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudyProgress({ tasks, sessions, isLoading }) {
  const getWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const weekData = days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + index + 1);
      
      const daysSessions = sessions.filter(session => {
        const sessionDate = new Date(session.created_date);
        return sessionDate.toDateString() === date.toDateString();
      });
      
      const totalMinutes = daysSessions.reduce((sum, session) => sum + session.duration_minutes, 0);
      
      return {
        day,
        hours: Math.round(totalMinutes / 60 * 10) / 10,
        sessions: daysSessions.length
      };
    });
    
    return weekData;
  };

  const getTaskCompletion = () => {
    const completed = tasks.filter(task => task.status === 'completed').length;
    const total = tasks.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const weeklyData = getWeeklyData();
  const taskCompletion = getTaskCompletion();
  const totalWeeklyHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Weekly Study Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ) : (
          <>
            <div className="h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-500"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-500"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name) => [`${value}h`, 'Study Hours']}
                  />
                  <Bar 
                    dataKey="hours" 
                    fill="url(#colorGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">This Week</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalWeeklyHours}h</p>
                <p className="text-xs text-gray-500">Total study time</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Tasks Done</span>
                </div>
                <div className="space-y-2">
                  <Progress value={taskCompletion} className="h-2" />
                  <p className="text-xs text-gray-500">{taskCompletion}% completed</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}