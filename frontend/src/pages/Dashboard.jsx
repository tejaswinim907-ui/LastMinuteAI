import { useEffect, useMemo, useState } from "react";
import { getAllTasks } from "../services/firestore";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const { displayName } = useTheme();

  useEffect(() => {
    async function loadTasks() {
      const data = await getAllTasks();
      setTasks(data);
    }

    loadTasks();
  }, []);

  const pendingTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed), [tasks]);
  const nextTask = useMemo(() => {
    return [...pendingTasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
  }, [pendingTasks]);

  return (
    <div>
      <h1 className="text-4xl font-bold">👋 Good Morning, {displayName}</h1>

        <p className="text-gray-500 mt-2">
          Here is a live snapshot of your current plan.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg">📋 Today's Tasks</h2>
            <ul className="mt-4 space-y-2">
              {pendingTasks.length > 0 ? (
                pendingTasks.slice(0, 5).map((task) => (
                  <li key={task.id} className="text-sm text-gray-700">
                    • {task.title}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No pending tasks yet.</li>
              )}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg">🤖 AI Suggestion</h2>
            <p className="mt-4 text-sm text-gray-700">
              {nextTask
                ? `Focus first on ${nextTask.title} because it is due soon.`
                : "Add a task to start planning your day."}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg">📅 Upcoming Deadline</h2>
            <p className="mt-4 text-sm text-gray-700">
              {nextTask ? nextTask.title : "No upcoming deadline"}
            </p>
            <p className="text-red-500 font-bold">
              {nextTask ? new Date(nextTask.deadline).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg">✅ Completed</h2>
            <p className="text-3xl font-bold mt-3">{completedTasks.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg">⏳ Pending</h2>
            <p className="text-3xl font-bold mt-3">{pendingTasks.length}</p>
          </div>
        </div>
    </div>
  );
}

export default Dashboard;