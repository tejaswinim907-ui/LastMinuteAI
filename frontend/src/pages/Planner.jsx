import { useEffect, useMemo, useState } from "react";
import { getAllTasks } from "../services/firestore";

function Planner() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      const data = await getAllTasks();
      setTasks(data);
    }

    loadTasks();
  }, []);

  const pendingTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks]);
  const upcomingTasks = useMemo(() => {
    return [...pendingTasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 5);
  }, [pendingTasks]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Planner</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Suggested Plan</h2>
          <ul className="space-y-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task, index) => (
                <li key={task.id} className="border-b pb-2">
                  <div className="font-medium">{index + 1}. {task.title}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(task.deadline).toLocaleString()}
                    {task.priority ? `• ${task.priority}` : ""}
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No pending tasks to plan yet.</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Today’s Focus</h2>
          <p className="text-gray-600">
            Start with the task that is closest to its deadline and work through the list one by one.
          </p>
          <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
            {upcomingTasks[0]
              ? `Priority task: ${upcomingTasks[0].title}`
              : "Add a task to build your plan."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planner;