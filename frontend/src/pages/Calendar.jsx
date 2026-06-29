import { useEffect, useMemo, useState } from "react";
import { getAllTasks } from "../services/firestore";

function Calendar() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      const data = await getAllTasks();
      setTasks(data);
    }

    loadTasks();
  }, []);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }, [tasks]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-4">Upcoming Deadlines</h2>
        <div className="space-y-3">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-3">
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-500">
                  {new Date(task.deadline).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No scheduled tasks yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calendar;