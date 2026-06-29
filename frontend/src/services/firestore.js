const STORAGE_KEY = "lastminute_ai_tasks";

function readTasksFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to read stored tasks:", error);
    return [];
  }
}

function writeTasksToStorage(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to storage:", error);
  }
}

export async function saveTask(task) {
  const newTask = {
    id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: task.title,
    deadline: task.deadline,
    completed: task.completed ?? false,
    priority: task.priority ?? null,
  };

  const tasks = readTasksFromStorage();
  tasks.push(newTask);
  writeTasksToStorage(tasks);
  return newTask.id;
}

export async function deleteTask(id) {
  const tasks = readTasksFromStorage().filter((task) => task.id !== id);
  writeTasksToStorage(tasks);
}

export async function updateTaskStatus(id, completed) {
  const tasks = readTasksFromStorage().map((task) =>
    task.id === id ? { ...task, completed } : task
  );
  writeTasksToStorage(tasks);
}

export async function updateTask(id, updates) {
  const tasks = readTasksFromStorage().map((task) =>
    task.id === id ? { ...task, ...updates } : task
  );
  writeTasksToStorage(tasks);
}

export async function getAllTasks() {
  return readTasksFromStorage();
}
