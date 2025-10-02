import React, { useState, useEffect } from "react";
import { StudyTask } from "@/entities/StudyTask";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnimatePresence } from "framer-motion";

import TaskForm from "../components/tasks/TaskForm";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskItem from "../components/tasks/TaskItem";
import TaskStats from "../components/tasks/TaskStats";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ 
    status: "all", 
    priority: "all", 
    subject: "all",
    category: "all"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    const fetchedTasks = await StudyTask.list("-due_date");
    setTasks(fetchedTasks);
    setIsLoading(false);
  };

  const handleSubmit = async (taskData) => {
    if (editingTask) {
      await StudyTask.update(editingTask.id, taskData);
    } else {
      await StudyTask.create(taskData);
    }
    setShowForm(false);
    setEditingTask(null);
    loadTasks();
  };

  const handleStatusChange = async (task, newStatus) => {
    await StudyTask.update(task.id, { ...task, status: newStatus });
    loadTasks();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    await StudyTask.delete(taskId);
    loadTasks();
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const statusMatch = filters.status === "all" || task.status === filters.status;
      const priorityMatch = filters.priority === "all" || task.priority === filters.priority;
      const subjectMatch = filters.subject === "all" || task.subject === filters.subject;
      const categoryMatch = filters.category === "all" || task.category === filters.category;
      const searchMatch = searchTerm === "" || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      return statusMatch && priorityMatch && subjectMatch && categoryMatch && searchMatch;
    });
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Study Tasks</h1>
            <p className="text-gray-600">Organize and track your academic tasks</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Task
          </Button>
        </div>

        {/* Task Statistics */}
        <TaskStats tasks={tasks} isLoading={isLoading} />

        {/* Task Form */}
        <AnimatePresence>
          {showForm && (
            <TaskForm
              task={editingTask}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tasks by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80"
              />
            </div>
            <TaskFilters 
              filters={filters}
              onFilterChange={setFilters}
              tasks={tasks}
            />
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <AnimatePresence>
            {isLoading ? (
              <div className="grid gap-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}