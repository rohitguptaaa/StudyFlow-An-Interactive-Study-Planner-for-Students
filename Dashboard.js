import React, { useState, useEffect } from "react";
import { StudyTask, StudySession, StudyGoal } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BookOpen, Clock, Target, TrendingUp, Plus, Calendar,
  AlertCircle, CheckCircle2, Timer, Award
} from "lucide-react";

import StatsOverview from "../components/dashboard/StatsOverview";
import UpcomingTasks from "../components/dashboard/UpcomingTasks";
import StudyProgress from "../components/dashboard/StudyProgress";
import RecentSessions from "../components/dashboard/RecentSessions";
import WeeklyGoals from "../components/dashboard/WeeklyGoals";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [tasksData, sessionsData, goalsData] = await Promise.all([
        StudyTask.list("-created_date", 20),
        StudySession.list("-created_date", 10),
        StudyGoal.list("-created_date", 5)
      ]);
      
      setTasks(tasksData);
      setSessions(sessionsData);
      setGoals(goalsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks.filter(task => 
      task.status !== 'completed' && 
      new Date(task.due_date) <= nextWeek
    ).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  };

  const getTotalStudyHours = () => {
    return sessions.reduce((total, session) => total + (session.duration_minutes / 60), 0);
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => task.status === 'completed').length;
  };

  const getAverageProductivity = () => {
    const ratingsSum = sessions.reduce((sum, session) => sum + (session.productivity_rating || 0), 0);
    return sessions.length > 0 ? ratingsSum / sessions.length : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600">Ready to tackle your study goals today?</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link to={createPageUrl("StudyTimer")} className="flex-1 md:flex-none">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Timer className="w-4 h-4 mr-2" />
                Start Studying
              </Button>
            </Link>
            <Link to={createPageUrl("Tasks")} className="flex-1 md:flex-none">
              <Button variant="outline" className="w-full bg-white/80 backdrop-blur-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsOverview
            title="Total Study Hours"
            value={`${getTotalStudyHours().toFixed(1)}h`}
            icon={Clock}
            color="blue"
            trend="+2.5h this week"
          />
          <StatsOverview
            title="Tasks Completed"
            value={getCompletedTasks()}
            icon={CheckCircle2}
            color="green"
            trend={`${tasks.length - getCompletedTasks()} remaining`}
          />
          <StatsOverview
            title="Study Streak"
            value="7 days"
            icon={Award}
            color="purple"
            trend="Keep it up!"
          />
          <StatsOverview
            title="Avg Productivity"
            value={`${getAverageProductivity().toFixed(1)}/5`}
            icon={TrendingUp}
            color="orange"
            trend="Based on sessions"
          />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Larger Cards */}
          <div className="lg:col-span-2 space-y-6">
            <StudyProgress 
              tasks={tasks}
              sessions={sessions}
              isLoading={isLoading}
            />
            <UpcomingTasks 
              tasks={getUpcomingTasks()}
              isLoading={isLoading}
              onTaskUpdate={loadDashboardData}
            />
          </div>

          {/* Right Column - Smaller Cards */}
          <div className="space-y-6">
            <WeeklyGoals 
              goals={goals}
              isLoading={isLoading}
            />
            <RecentSessions 
              sessions={sessions.slice(0, 5)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}