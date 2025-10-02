import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function TaskFilters({ filters, onFilterChange, tasks }) {
  const getUniqueSubjects = () => {
    const subjects = [...new Set(tasks.map(task => task.subject))];
    return subjects.sort();
  };

  const handleFilterChange = (type, value) => {
    onFilterChange({ ...filters, [type]: value });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>
      
      <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
        <SelectTrigger className="w-32 bg-white/80">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
        <SelectTrigger className="w-32 bg-white/80">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.subject} onValueChange={(value) => handleFilterChange("subject", value)}>
        <SelectTrigger className="w-36 bg-white/80">
          <SelectValue placeholder="Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subjects</SelectItem>
          {getUniqueSubjects().map(subject => (
            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
        <SelectTrigger className="w-32 bg-white/80">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="assignment">Assignment</SelectItem>
          <SelectItem value="exam">Exam</SelectItem>
          <SelectItem value="reading">Reading</SelectItem>
          <SelectItem value="project">Project</SelectItem>
          <SelectItem value="revision">Revision</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}