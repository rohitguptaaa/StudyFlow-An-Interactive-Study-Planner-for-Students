import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

export default function TimerSettings({ settings, onSettingsChange }) {
  const handleChange = (type, value) => {
    const newSettings = {
      ...settings,
      [type]: Math.max(1, Math.min(120, parseInt(value) || 0))
    };
    onSettingsChange(newSettings);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5 text-blue-600" />
          Timer Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-sm">Pomodoro Duration</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="60"
              value={settings.pomodoro}
              onChange={(e) => handleChange('pomodoro', e.target.value)}
              className="bg-white/80"
            />
            <span className="text-sm text-gray-500">min</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Short Break</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="30"
              value={settings.shortBreak}
              onChange={(e) => handleChange('shortBreak', e.target.value)}
              className="bg-white/80"
            />
            <span className="text-sm text-gray-500">min</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Long Break</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="60"
              value={settings.longBreak}
              onChange={(e) => handleChange('longBreak', e.target.value)}
              className="bg-white/80"
            />
            <span className="text-sm text-gray-500">min</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Deep Work</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="30"
              max="120"
              value={settings.deepWork}
              onChange={(e) => handleChange('deepWork', e.target.value)}
              className="bg-white/80"
            />
            <span className="text-sm text-gray-500">min</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Adjust timer durations to match your study preferences
          </p>
        </div>
      </CardContent>
    </Card>
  );
}