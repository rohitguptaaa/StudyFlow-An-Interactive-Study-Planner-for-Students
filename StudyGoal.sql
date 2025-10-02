{
  "name": "StudyGoal",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Goal title"
    },
    "description": {
      "type": "string",
      "description": "Goal description"
    },
    "target_hours_weekly": {
      "type": "number",
      "description": "Target study hours per week"
    },
    "target_date": {
      "type": "string",
      "format": "date",
      "description": "Target completion date"
    },
    "current_progress": {
      "type": "number",
      "default": 0,
      "minimum": 0,
      "maximum": 100,
      "description": "Current progress percentage"
    },
    "category": {
      "type": "string",
      "enum": [
        "academic",
        "skill",
        "certification",
        "personal"
      ],
      "default": "academic",
      "description": "Goal category"
    }
  },
  "required": [
    "title",
    "target_date"
  ]
}