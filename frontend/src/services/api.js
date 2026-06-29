const API_URL = "http://127.0.0.1:8000";

export async function getTasks() {
  const response = await fetch(`${API_URL}/tasks`);
  return await response.json();
}

export async function createTask(task) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  return await response.json();
}