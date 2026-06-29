import { useState, useEffect } from "react";
import AIResult from "../components/AIResult";
import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";
import Login from "../components/Login";
import {
  saveTask,
  getAllTasks,
  deleteTask,
  updateTaskStatus,
  updateTask,
} from "../services/firestore";

const API_URL = "http://127.0.0.1:8000";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  // Load tasks from Firebase
  async function loadTasks() {
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // Add Task
  async function addTask() {
    if (!title || !deadline) {
      alert("Please enter title and deadline");
      return;
    }

    const newTask = {
      title,
      deadline,
      completed: false,
    };

    const tempId = `temp-${Date.now()}`;

    setTasks((prev) => [
      ...prev,
      { id: tempId, ...newTask },
    ]);

    setTitle("");
    setDeadline("");

    try {
      const id = await saveTask(newTask);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === tempId ? { ...task, id } : task
        )
      );
      await loadTasks();
      notifyUser("Task added", `${newTask.title} saved successfully.`);
    } catch (error) {
      console.log(error);
      setTasks((prev) => prev.filter((task) => task.id !== tempId));
      alert("Failed to save task");
    }
  }

  async function deleteTaskById(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      if (editingTaskId === id) {
        setEditingTaskId(null);
      }
      notifyUser("Task deleted", "Task removed successfully.");
    } catch (error) {
      console.log(error);
      alert("Failed to delete task");
    }
  }

  async function completeTask(id) {
    try {
      await updateTaskStatus(id, true);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: true } : task
        )
      );
      notifyUser("Task completed", "Nice work — task marked complete.");
    } catch (error) {
      console.log(error);
      alert("Failed to mark task complete");
    }
  }

  function startEditTask(task) {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDeadline(task.deadline);
  }

  function cancelEdit() {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDeadline("");
  }

  async function saveTaskEdits(id) {
    if (!editTitle || !editDeadline) {
      alert("Please enter title and deadline for the task.");
      return;
    }

    try {
      await updateTask(id, {
        title: editTitle,
        deadline: editDeadline,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, title: editTitle, deadline: editDeadline }
            : task
        )
      );
      cancelEdit();
      notifyUser("Task updated", "Your task changes have been saved.");
    } catch (error) {
      console.log(error);
      alert("Failed to update task");
    }
  }

  function inferTaskPriority(deadline) {
    if (!deadline) {
      return "Medium";
    }

    const dueDate = new Date(deadline);
    if (Number.isNaN(dueDate.getTime())) {
      return "Medium";
    }

    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();

    if (diff <= 0) {
      return "Critical";
    }
    if (diff <= 24 * 60 * 60 * 1000) {
      return "High";
    }
    if (diff <= 72 * 60 * 60 * 1000) {
      return "Medium";
    }

    return "Low";
  }

  function mapTaskPriority(task, priorityItems) {
    const taskKey = `${task.title} (Deadline: ${task.deadline})`;
    const match = priorityItems.find(
      (item) => item.task === taskKey
    );
    return match?.level || inferTaskPriority(task.deadline);
  }

  function sortTasksByPriority(tasksList) {
    const order = {
      Critical: 0,
      High: 1,
      Medium: 2,
      Low: 3,
      null: 4,
      undefined: 4,
    };

    return [...tasksList].sort((a, b) => {
      const priorityA = order[a.priority] ?? 4;
      const priorityB = order[b.priority] ?? 4;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return dateA - dateB;
    });
  }

  async function persistTaskPriorities(tasksWithPriority) {
    await Promise.all(
      tasksWithPriority.map((task) =>
        updateTask(task.id, { priority: task.priority })
      )
    );
  }

  function notifyUser(title, body) {
    if (!("Notification" in window)) {
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(title, { body });
      return;
    }

    if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      });
    }
  }

  // Filtered tasks
  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.deadline.toLowerCase().includes(query);

    if (!query && filterStatus === "all" && priorityFilter === "all") {
      return true;
    }

    if (!matchesQuery) {
      return false;
    }

    if (filterStatus === "completed" && !task.completed) {
      return false;
    }

    if (filterStatus === "pending" && task.completed) {
      return false;
    }

    if (priorityFilter !== "all" && task.priority !== priorityFilter) {
      return false;
    }

    return true;
  });

  // AI Prioritize
  async function prioritizeTasks() {
    try {
      const response = await fetch(
        `${API_URL}/ai/prioritize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tasks: tasks.map(
              (task) =>
                `${task.title} (Deadline: ${task.deadline})`
            ),
          }),
        }
      );

      const data = await response.json();
      const result = data.result ?? data;
      const workHours = tasks.length * 2;
      const availableHours = Math.max(8 - workHours, 0);

      const rescue = {
        work_hours: result.rescue?.work_hours || String(workHours),
        available_hours: result.rescue?.available_hours || String(availableHours),
        status:
          result.rescue?.status ||
          (workHours <= 8 ? "On Track" : "Overloaded"),
        recommendation:
          result.rescue?.recommendation || [
            "Complete high priority tasks first.",
            "Take breaks between tasks.",
            "Avoid overloading your day.",
          ],
      };

      const priorityItems = result.priority || [];
      const tasksWithPriority = sortTasksByPriority(
        tasks.map((task) => ({
          ...task,
          priority: mapTaskPriority(task, priorityItems),
        }))
      );

      setTasks(tasksWithPriority);
      await persistTaskPriorities(tasksWithPriority);

      setAiResult({
        ...result,
        rescue,
      });
    } catch (error) {
      console.log(error);
      alert("AI Prioritize Failed");
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Login />
        </div>

        <h1 className="text-4xl font-bold mb-8">
          🤖 LastMinute AI
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Tasks"
            value={tasks.length}
            color="bg-blue-500"
          />

          <StatsCard
            title="Completed"
            value={completedCount}
            color="bg-green-500"
          />

          <StatsCard
            title="Pending"
            value={pendingCount}
            color="bg-orange-500"
          />
        </div>

        {/* Add Task */}
        <div className="bg-white shadow rounded-xl p-6 mb-8">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="border p-3 rounded w-full mb-3"
          />

          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) =>
              setDeadline(e.target.value)
            }
            className="border p-3 rounded w-full mb-4"
          />

          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-5 py-3 rounded mr-3"
          >
            Add Task
          </button>

          <button
            onClick={prioritizeTasks}
            className="bg-green-600 text-white px-5 py-3 rounded"
          >
            AI Prioritize
          </button>
        </div>

        {/* Task List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            📋 My Tasks
          </h2>

          <div className="flex flex-col lg:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-3 rounded w-full lg:w-1/2"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border p-3 rounded w-full lg:w-1/4"
            >
              <option value="all">All tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border p-3 rounded w-full lg:w-1/4"
            >
              <option value="all">All priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {filteredTasks.length === 0 ? (
            <p>No tasks match your search or filter.</p>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={deleteTaskById}
                onComplete={completeTask}
                onEdit={startEditTask}
                isEditing={editingTaskId === task.id}
                editTitle={editTitle}
                editDeadline={editDeadline}
                onChangeTitle={setEditTitle}
                onChangeDeadline={setEditDeadline}
                onSaveEdit={saveTaskEdits}
                onCancelEdit={cancelEdit}
              />
            ))
          )}
        </div>

        {/* AI Dashboard */}
        <AIResult result={aiResult} />
      </div>
    );
  }

export default Tasks;