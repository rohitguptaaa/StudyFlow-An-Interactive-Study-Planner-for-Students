{
  "name": "StudySession",
  "type": "object",
  "properties": {
    "task_id": {
      "type": "string",
      "description": "ID of associated study task"
    },
    "duration_minutes": {
      "type": "number",
      "description": "Session duration in minutes"
    },
    "session_type": {
      "type": "string",
      "enum": [
        "pomodoro",
        "deep_work",
        "review",
        "practice"
      ],
      "default": "pomodoro",
      "description": "Type of study session"
    },
    "notes": {
      "type": "string",
      "description": "Session notes"
    },
    "productivity_rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 5,
      "description": "Self-rated productivity (1-5)"
    },
    "completed": {
      "type": "boolean",
      "default": false,
      "description": "Whether session was completed"
    }
  },
  "required": [
    "duration_minutes",
    "session_type"
  ]
}