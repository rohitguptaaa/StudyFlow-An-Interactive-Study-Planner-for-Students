import React from 'react';
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const sessionTypeColors = {
  pomodoro: "bg-red-100 text-red-800 border-red-200",
  deep_work: "bg-blue-100 text-blue-800 border-blue-200",
  review: "bg-green-100 text-green-800 border-green-200",
  practice: "bg-purple-100 text-purple-800 border-purple-200"
};

export default function RecentSessions({ sessions, isLoading }) {
  const renderProductivityStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-green-600" />
          Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-6 text-center">
            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No study sessions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="outline"
                        className={`${sessionTypeColors[session.session_type]} text-xs`}
                      >
                        {session.session_type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {session.duration_minutes}min
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {format(new Date(session.created_date), "MMM d, h:mm a")}
                    </p>
                    {session.productivity_rating && (
                      <div className="flex items-center gap-1 mt-1">
                        {renderProductivityStars(session.productivity_rating)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}