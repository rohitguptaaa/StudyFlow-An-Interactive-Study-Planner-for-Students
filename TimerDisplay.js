import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, Coffee, BookOpen } from "lucide-react";

const sessionConfig = {
  pomodoro: { icon: Timer, color: "text-red-600", bg: "from-red-500 to-pink-600" },
  short_break: { icon: Coffee, color: "text-green-600", bg: "from-green-500 to-emerald-600" },
  long_break: { icon: Coffee, color: "text-blue-600", bg: "from-blue-500 to-cyan-600" },
  deep_work: { icon: BookOpen, color: "text-purple-600", bg: "from-purple-500 to-indigo-600" }
};

export default function TimerDisplay({ timeLeft, sessionType, progress, isRunning }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const config = sessionConfig[sessionType] || sessionConfig.pomodoro;
  const IconComponent = config.icon;

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${config.bg} rounded-full flex items-center justify-center shadow-lg`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <h3 className={`text-lg font-semibold ${config.color} capitalize`}>
            {sessionType.replace('_', ' ')} Session
          </h3>
        </div>

        <div className="mb-8">
          <div className={`text-6xl md:text-8xl font-mono font-bold mb-4 ${
            isRunning ? 'text-gray-900' : 'text-gray-600'
          }`}>
            {formatTime(timeLeft)}
          </div>
          {isRunning && (
            <div className="text-sm text-green-600 animate-pulse">
              ● Session in progress
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Progress 
            value={progress} 
            className="h-3 bg-gray-100"
            style={{
              background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))'
            }}
          />
          <p className="text-sm text-gray-500">
            {Math.round(progress)}% complete
          </p>
        </div>
      </CardContent>
    </Card>
  );
}