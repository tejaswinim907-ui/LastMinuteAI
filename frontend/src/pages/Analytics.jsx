import { useEffect, useMemo, useState } from "react";
import { getAllTasks } from "../services/firestore";

function Analytics() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      const data = await getAllTasks();
      setTasks(data);
    }

    loadTasks();
  }, []);

  const completed = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);
  const pending = useMemo(() => tasks.length - completed, [tasks]);
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold">Total Tasks</h2>
          <p className="text-3xl font-bold mt-2">{tasks.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold">Completed</h2>
          <p className="text-3xl font-bold mt-2">{completed}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold">Completion Rate</h2>
          <p className="text-3xl font-bold mt-2">{completionRate}%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-3">Progress Snapshot</h2>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-green-500 h-3 rounded-full" style={{ width: `${completionRate}%` }} />
        </div>
        <p className="text-sm text-gray-500 mt-3">
          {pending} tasks still pending and {completed} completed.
        </p>
      </div>
    </div>
  );
}

export default Analytics;