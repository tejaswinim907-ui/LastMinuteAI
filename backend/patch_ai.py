from pathlib import Path

path = Path('app/ai.py')
text = path.read_text()
start = text.index('def prioritize_tasks(tasks):')
next_def = text.find('\ndef ', start + 1)
end = next_def if next_def != -1 else len(text)

new_block = '''def prioritize_tasks(tasks):
    if not tasks:
        return {
            "priority": [],
            "schedule": [],
            "tips": [],
            "risk": "On Track",
            "rescue": {
                "work_hours": "0",
                "available_hours": "8",
                "status": "On Track",
                "recommendation": DEFAULT_RECOMMENDATIONS.copy(),
            },
        }

    if model is None:
        return fallback_response(tasks)

    prompt = f"""
You are an AI Productivity Assistant.

Analyze the following tasks and deadlines. Use the deadline details to determine urgency and recommend priorities.

Tasks:
{json.dumps(tasks, indent=2)}

Return only valid JSON with these exact keys:
- priority: array of {{ task, level }} objects
- level must be one of: Critical, High, Medium, Low
- schedule: array of {{ time, task }} objects
- tips: array of short strings
- risk: short status string
- rescue: object with work_hours, available_hours, status, recommendation

Example output:
{{
  "priority":[{{"task":"Buy groceries (Deadline: Today)","level":"Critical"}}],
  "schedule":[{{"time":"09:00 AM","task":"Buy groceries (Deadline: Today)"}}],
  "tips":["Finish the most urgent tasks first.","Avoid distractions."],
  "risk":"On Track",
  "rescue":{{"work_hours":"2","available_hours":"6","status":"On Track","recommendation":["Focus on highest priority tasks."]}}
}}

Do not include markdown, backticks, or any extra text.
"""

    try:
        response = model.generate_content(prompt)
        text = getattr(response, "text", None) or str(response)
        text = extract_json(text)

        parsed = parse_json_text(text)
        if parsed is None:
            raise ValueError("Unable to parse JSON from AI output")

        normalized = normalize_result(parsed, tasks)
        if normalized is None:
            raise ValueError("Normalized result is invalid")

        return normalized

    except Exception as e:
        print("AI Error:", e)
        return fallback_response(tasks)
'''

path.write_text(text[:start] + new_block + text[end:])
print('patched')
