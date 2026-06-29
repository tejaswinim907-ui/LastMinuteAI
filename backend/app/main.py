from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.ai import prioritize_tasks

app = FastAPI(title="LastMinute AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tasks = []

# ---------- Models ----------

class Task(BaseModel):
    title: str
    deadline: str


class AIRequest(BaseModel):
    tasks: list[str]


# ---------- Routes ----------

@app.get("/")
def home():
    return {
        "message": "LastMinute AI Backend"
    }


@app.get("/tasks")
def get_tasks():
    return tasks


@app.post("/tasks")
def create_task(task: Task):
    tasks.append(task.dict())

    return {
        "message": "Task Added",
        "task": task
    }


@app.post("/ai/prioritize")
def ai_prioritize(data: AIRequest):

    result = prioritize_tasks(data.tasks)

    return {
        "result": result
    }