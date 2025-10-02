import React from 'react';
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Timer, Coffee, BookOpen } from "lucide-react";

const sessionTypeConfig = {
  pomodoro: { icon: Timer, color: "bg-red-100 text-red-800 border-red-200" },
  short_break: { icon: Coffee, color: "bg-green-100 text-green-800 border-green-200" },
  long_break: { icon: Coffee, color: "bg-blue-100 text-blue-800 border-blue-200" },
  deep_work: { icon: BookOpen, color: "bg-purple-100 text-purple-800 border-purple-200" }
};

export default function SessionHistory({ sessions }) {
  const todaySessions = sessions.filter(session => {
    const today = new Date();
    const sessionDate = new Date(session.created_date);
    return sessionDate.toDateString() === today.toDateString();
  });

  const totalTimeToday = todaySessions.reduce((sum, session) => sum + session.duration_minutes, 0);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-green-600" />
          Today's Sessions
        </CardTitle>
        {totalTimeToday > 0 && (
          <p className="text-sm text-gray-500">
            Total: {Math.round(totalTimeToday / 60 * 10) / 10}h studied
          </p>
        )}
      </CardHeader>
      <CardContent className="p-4">
        {todaySessions.length === 0 ? (
          <div className="text-center py-6">
            <Timer className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No sessions today</p>
            <p className="text-xs text-gray-400">Start your first study session!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {todaySessions.map((session) => {
              const config = sessionTypeConfig[session.session_type] || sessionTypeConfig.pomodoro;
              const IconComponent = config.icon;
              
              return (
                <div key={session.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`${config.color} text-xs`}>
                        {session.session_type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {session.duration_minutes}min
                      </span>
                      {session.completed && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {format(new Date(session.created_date), "h:mm a")}
                    </p>
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