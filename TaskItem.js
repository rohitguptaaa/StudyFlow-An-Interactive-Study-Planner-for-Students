import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  BookOpen, Calendar, Clock, MoreVertical, Edit,
  Trash2, Play, CheckCircle2, AlertCircle
} from "lucide-react";

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  urgent: "bg-red-100 text-red-800 border-red-200"
};

const statusColors = {
  pending: "bg-gray-100 text-gray-800 border-gray-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  overdue: "bg-red-100 text-red-800 border-red-200"
};

const categoryIcons = {
  assignment: BookOpen,
  exam: AlertCircle,
  reading: BookOpen,
  project: BookOpen,
  revision: Clock,
  other: BookOpen
};

export default function TaskItem({ task, onStatusChange, onEdit, onDelete }) {
  const getDaysUntilDue = () => {
    const today = new Date();
    const due = new Date(task.due_date);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusFromDate = () => {
    if (task.status === 'completed') return 'completed';
    const daysUntil = getDaysUntilDue();
    return daysUntil < 0 ? 'overdue' : task.status;
  };

  const currentStatus = getStatusFromDate();
  const daysUntil = getDaysUntilDue();
  const CategoryIcon = categoryIcons[task.category] || BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
        currentStatus === 'completed' ? 'opacity-75' : ''
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                <CategoryIcon className="w-6 h-6 text-blue-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-lg mb-2 ${
                  currentStatus === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                
                <p className="text-gray-600 mb-3">{task.subject}</p>
                
                {task.description && (
                  <p className="text-sm text-gray-500 mb-3">{task.description}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="outline" className={priorityColors[task.priority]}>
                    {task.priority} priority
                  </Badge>
                  <Badge variant="outline" className={statusColors[currentStatus]}>
                    {currentStatus.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                    {task.category}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due {format(new Date(task.due_date), "MMM d, yyyy")}</span>
                  </div>
                  {daysUntil >= 0 && currentStatus !== 'completed' && (
                    <div className={`flex items-center gap-1 ${
                      daysUntil <= 1 ? 'text-red-600' : daysUntil <= 3 ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        {daysUntil === 0 ? 'Due today' : 
                         daysUntil === 1 ? 'Due tomorrow' : 
                         `${daysUntil} days left`}
                      </span>
                    </div>
                  )}
                  {task.estimated_hours && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{task.estimated_hours}h estimated</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {currentStatus !== 'completed' && (
                <Button
                  size="sm"
                  onClick={() => onStatusChange(task, 'completed')}
                  className="bg-green-100 text-green-700 hover:bg-green-200"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Task
                  </DropdownMenuItem>
                  {currentStatus !== 'completed' && (
                    <DropdownMenuItem onClick={() => onStatusChange(task, 'in_progress')}>
                      <Play className="w-4 h-4 mr-2" />
                      Start Working
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}