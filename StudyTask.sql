{
  "name": "StudyTask",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Task title"
    },
    "description": {
      "type": "string",
      "description": "Task description"
    },
    "subject": {
      "type": "string",
      "description": "Subject/course name"
    },
    "priority": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "urgent"
      ],
      "default": "medium",
      "description": "Task priority"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "in_progress",
        "completed",
        "overdue"
      ],
      "default": "pending",
      "description": "Task status"
    },
    "due_date": {
      "type": "string",
      "format": "date",
      "description": "Due date"
    },
    "estimated_hours": {
      "type": "number",
      "description": "Estimated study hours needed"
    },
    "actual_hours": {
      "type": "number",
      "default": 0,
      "description": "Actual hours spent"
    },
    "category": {
      "type": "string",
      "enum": [
        "assignment",
        "exam",
        "reading",
        "project",
        "revision",
        "other"
      ],
      "default": "other",
      "description": "Task category"
    }
  },
  "required": [
    "title",
    "subject",
    "due_date"
  ]
}