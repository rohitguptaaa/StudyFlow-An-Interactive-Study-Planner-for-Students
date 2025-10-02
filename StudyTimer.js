import React, { useState, useEffect, useRef } from "react";
import { StudySession, StudyTask } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Play, Pause, Square, RotateCcw, Clock, 
  Timer, Target, Coffee, BookOpen
} from "lucide-react";

import TimerDisplay from "../components/timer/TimerDisplay";
import SessionHistory from "../components/timer/SessionHistory";
import TimerSettings from "../components/timer/TimerSettings";

export default function StudyTimerPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [sessionType, setSessionType] = useState("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [notes, setNotes] = useState("");
  const [settings, setSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    deepWork: 90
  });

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    loadTasks();
    loadSessions();
    // Create audio context for notifications
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkcBB2XAAA=');
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      if (timeLeft === 0 && isRunning) {
        // Handle session complete inline
        setIsRunning(false);
        audioRef.current?.play().catch(() => {}); // Notification sound
        
        if (currentSession) {
          const duration = getSessionDuration(sessionType) / 60;
          saveSession(duration, true);
        }
        
        // Auto-start break for pomodoro sessions
        if (sessionType === 'pomodoro') {
          const breakType = sessions.filter(s => s.session_type === 'pomodoro').length % 4 === 3 
            ? 'long_break' 
            : 'short_break';
          setSessionType(breakType);
          setTimeLeft(getSessionDuration(breakType));
        } else {
          resetTimer();
        }
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, currentSession, sessionType, sessions]);

  const loadTasks = async () => {
    const tasksData = await StudyTask.list("-due_date");
    const activeTasks = tasksData.filter(task => task.status !== 'completed');
    setTasks(activeTasks);
  };

  const loadSessions = async () => {
    const sessionsData = await StudySession.list("-created_date", 10);
    setSessions(sessionsData);
  };

  const getSessionDuration = (type) => {
    const durations = {
      pomodoro: settings.pomodoro,
      short_break: settings.shortBreak,
      long_break: settings.longBreak,
      deep_work: settings.deepWork
    };
    return (durations[type] || 25) * 60;
  };

  const startSession = () => {
    if (!isRunning) {
      setIsRunning(true);
      setCurrentSession({
        startTime: Date.now(),
        type: sessionType,
        taskId: selectedTaskId
      });
    }
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const stopSession = async () => {
    setIsRunning(false);
    
    if (currentSession) {
      const duration = Math.round((Date.now() - currentSession.startTime) / 60000);
      if (duration > 0) {
        await saveSession(duration, false);
      }
    }
    
    resetTimer();
  };

  const saveSession = async (duration, completed) => {
    const sessionData = {
      task_id: selectedTaskId || null,
      duration_minutes: duration,
      session_type: sessionType,
      notes: notes,
      completed: completed,
      productivity_rating: null // Will be set by user later
    };

    await StudySession.create(sessionData);
    
    // Update task actual hours if task is selected
    if (selectedTaskId && completed) {
      const task = tasks.find(t => t.id === selectedTaskId);
      if (task) {
        await StudyTask.update(selectedTaskId, {
          actual_hours: (task.actual_hours || 0) + (duration / 60)
        });
      }
    }

    setCurrentSession(null);
    setNotes("");
    loadSessions();
    loadTasks();
  };

  const resetTimer = () => {
    setTimeLeft(getSessionDuration(sessionType));
    setCurrentSession(null);
    setIsRunning(false);
  };

  const handleTypeChange = (type) => {
    setSessionType(type);
    setTimeLeft(getSessionDuration(type));
    setIsRunning(false);
    setCurrentSession(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((getSessionDuration(sessionType) - timeLeft) / getSessionDuration(sessionType)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Study Timer ⏰
          </h1>
          <p className="text-gray-600">Focus your mind, achieve your goals</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Timer Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Timer Display */}
            <TimerDisplay 
              timeLeft={timeLeft}
              sessionType={sessionType}
              progress={progress}
              isRunning={isRunning}
            />

            {/* Timer Controls */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Session Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Session Type Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'pomodoro', label: 'Pomodoro', icon: Timer, time: settings.pomodoro },
                    { value: 'short_break', label: 'Short Break', icon: Coffee, time: settings.shortBreak },
                    { value: 'long_break', label: 'Long Break', icon: Coffee, time: settings.longBreak },
                    { value: 'deep_work', label: 'Deep Work', icon: BookOpen, time: settings.deepWork }
                  ].map((type) => (
                    <Button
                      key={type.value}
                      variant={sessionType === type.value ? "default" : "outline"}
                      onClick={() => handleTypeChange(type.value)}
                      className={`h-auto p-4 flex flex-col items-center gap-2 ${
                        sessionType === type.value 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                          : 'bg-white/80 hover:bg-white'
                      }`}
                      disabled={isRunning}
                    >
                      <type.icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{type.label}</span>
                      <span className="text-xs opacity-75">{type.time}min</span>
                    </Button>
                  ))}
                </div>

                {/* Task Selection */}
                <div className="space-y-2">
                  <Label>Associated Task (Optional)</Label>
                  <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                    <SelectTrigger className="bg-white/80">
                      <SelectValue placeholder="Select a task to work on" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>No specific task</SelectItem>
                      {tasks.map(task => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.subject} - {task.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Session Notes */}
                <div className="space-y-2">
                  <Label>Session Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What are you working on? Any observations?"
                    className="bg-white/80"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex justify-center gap-4">
                  {!isRunning ? (
                    <Button
                      onClick={startSession}
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Session
                    </Button>
                  ) : (
                    <Button
                      onClick={pauseSession}
                      size="lg"
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 px-8"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  <Button
                    onClick={stopSession}
                    variant="outline"
                    size="lg"
                    className="bg-white/80"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Stop
                  </Button>
                  
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    size="lg"
                    className="bg-white/80"
                    disabled={isRunning}
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TimerSettings settings={settings} onSettingsChange={setSettings} />
            <SessionHistory sessions={sessions} />
          </div>
        </div>
      </div>
    </div>
  );
}