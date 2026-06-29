import ast
import os
import json
import re
from datetime import datetime, timedelta
from dotenv import load_dotenv

try:
    import google.generativeai as genai
except Exception:
    genai = None

# Load .env file
load_dotenv()

model = None
if genai is not None:
    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-2.5-flash")
    except Exception as exc:
        print("Gemini configuration failed:", exc)
        model = None

ALLOWED_PRIORITIES = ["Critical", "High", "Medium", "Low"]
DEFAULT_RECOMMENDATIONS = [
    "Complete high priority tasks first.",
    "Take breaks between tasks.",
    "Avoid overloading your day.",
]


def extract_json(text):
    if not isinstance(text, str):
        text = str(text)

    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)

    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return text[start:end + 1]

    return text


def parse_json_text(text):
    if text is None:
        return None

    cleaned = extract_json(text)
    if not cleaned:
        return None

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        try:
            return ast.literal_eval(cleaned)
        except (ValueError, SyntaxError):
            cleaned = cleaned.replace("'", '"')
            try:
                return json.loads(cleaned)
            except json.JSONDecodeError:
                return None


def normalize_priority(priority, tasks):
    if isinstance(priority, list) and priority:
        normalized = []
        for i, item in enumerate(priority):
            if not isinstance(item, dict):
                continue

            task_name = item.get("task") or ""
            level = str(item.get("level") or "").strip().title()
            if level not in ALLOWED_PRIORITIES:
                level = "High" if i == 0 else "Medium"

            normalized.append({"task": task_name, "level": level})

        if normalized:
            return normalized

    return [
        {"task": task, "level": "High" if index == 0 else "Medium"}
        for index, task in enumerate(tasks)
    ]


def normalize_schedule(schedule, tasks):
    if isinstance(schedule, list) and schedule:
        normalized = []
        for item in schedule:
            if not isinstance(item, dict):
                continue
            normalized.append(
                {
                    "time": str(item.get("time") or "").strip(),
                    "task": item.get("task") or "",
                }
            )
        if normalized:
            return normalized

    now = datetime.now()
    return [
        {
            "time": (now + timedelta(hours=i)).strftime("%I:%M %p"),
            "task": task,
        }
        for i, task in enumerate(tasks)
    ]


def normalize_tips(tips):
    if isinstance(tips, list) and tips:
        filtered = [str(item).strip() for item in tips if item not in [None, ""]]
        if filtered:
            return filtered

    return DEFAULT_RECOMMENDATIONS.copy()


def normalize_risk(risk):
    if isinstance(risk, str) and risk.strip():
        return risk.strip()
    return "On Track"


def normalize_rescue(rescue, tasks):
    rescue = rescue if isinstance(rescue, dict) else {}
    computed_work_hours = len(tasks) * 2
    computed_available_hours = max(8 - computed_work_hours, 0)

    work_hours = rescue.get("work_hours")
    available_hours = rescue.get("available_hours")
    status = rescue.get("status")
    recommendation = rescue.get("recommendation")

    return {
        "work_hours": str(work_hours).strip() if work_hours not in [None, ""] else str(computed_work_hours),
        "available_hours": str(available_hours).strip() if available_hours not in [None, ""] else str(computed_available_hours),
        "status": str(status).strip() if status else ("On Track" if computed_work_hours <= 8 else "Overloaded"),
        "recommendation": [
            str(item).strip()
            for item in recommendation
            if item not in [None, ""]
        ] if isinstance(recommendation, list) and recommendation else DEFAULT_RECOMMENDATIONS.copy(),
    }


def normalize_result(result, tasks):
    if not isinstance(result, dict):
        return None

    return {
        "priority": normalize_priority(result.get("priority"), tasks),
        "schedule": normalize_schedule(result.get("schedule"), tasks),
        "tips": normalize_tips(result.get("tips")),
        "risk": normalize_risk(result.get("risk")),
        "rescue": normalize_rescue(result.get("rescue"), tasks),
    }


def deadline_priority(task_text):
    if not isinstance(task_text, str):
        task_text = str(task_text or "")

    lower = task_text.lower()
    if any(keyword in lower for keyword in ["today", "urgent", "asap", "now", "immediately"]):
        return "Critical"
    if any(keyword in lower for keyword in ["tomorrow", "by tomorrow"]):
        return "High"

    if any(keyword in lower for keyword in ["next year", "next month", "next quarter", "next semester"]):
        return "Low"

    if any(keyword in lower for keyword in ["this week", "next week", "soon"]):
        return "Medium"

    iso_match = re.search(r"(\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2})?)", task_text)
    if iso_match:
        try:
            dt = datetime.fromisoformat(iso_match.group(1))
            today = datetime.now().date()
            if dt.date() <= today:
                return "Critical"
            if dt.date() == today + timedelta(days=1):
                return "High"
            if dt.date() <= today + timedelta(days=3):
                return "Medium"
        except ValueError:
            pass

    return "Low"


def fallback_response(tasks):
    now = datetime.now()
    schedule = [
        {
            "time": (now + timedelta(hours=i)).strftime("%I:%M %p"),
            "task": task,
        }
        for i, task in enumerate(tasks)
    ]

    work_hours = len(tasks) * 2
    available_hours = max(8 - work_hours, 0)
    status = "On Track" if work_hours <= 8 else "Overloaded"

    return {
        "priority": [
            {"task": task, "level": deadline_priority(task)}
            for task in tasks
        ],
        "schedule": schedule,
        "tips": DEFAULT_RECOMMENDATIONS.copy(),
        "risk": status,
        "rescue": {
            "work_hours": str(work_hours),
            "available_hours": str(available_hours),
            "status": status,
            "recommendation": DEFAULT_RECOMMENDATIONS.copy(),
        },
    }


def prioritize_tasks(tasks):
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

Analyze the following tasks and deadlines. Use the deadline details carefully and do not overestimate distant future wording.

Tasks:
{json.dumps(tasks, indent=2)}

Return only valid JSON with these exact keys:
- priority: array of {{ task, level }} objects
- level must be one of: Critical, High, Medium, Low
- schedule: array of {{ time, task }} objects
- tips: array of short strings
- risk: short status string
- rescue: object with work_hours, available_hours, status, recommendation

Rules:
- If a task says 'today', 'urgent', 'asap', 'now', or 'immediately', set it to Critical.
- If it says 'tomorrow', set it to High.
- If it says 'this week' or 'next week', set it to Medium.
- If it says 'next month', 'next year', 'next quarter', or similar distant future references, set it to Low.
- Keep the schedule realistic and ordered by urgency.

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
