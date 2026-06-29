import { FaTrash, FaCheckCircle, FaEdit, FaSave, FaTimes } from "react-icons/fa";

function TaskCard({
  task,
  onDelete,
  onComplete,
  onEdit,
  isEditing,
  editTitle,
  editDeadline,
  onChangeTitle,
  onChangeDeadline,
  onSaveEdit,
  onCancelEdit,
}) {
  const formattedDeadline = new Date(task.deadline).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div
      className={`bg-white shadow rounded-lg p-4 mb-4 ${
        task.completed ? "opacity-70" : ""
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            className="border p-3 rounded w-full"
            placeholder="Task Title"
          />
          <input
            type="datetime-local"
            value={editDeadline}
            onChange={(e) => onChangeDeadline(e.target.value)}
            className="border p-3 rounded w-full"
          />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3
              className={`font-bold text-lg ${
                task.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </h3>
            {task.priority && (
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                  task.priority === "Critical"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "High"
                    ? "bg-orange-100 text-orange-700"
                    : task.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {task.priority}
              </span>
            )}
          </div>

          <p className="text-gray-500">{formattedDeadline}</p>

          {task.completed && (
            <span className="inline-flex mt-2 px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
              Completed
            </span>
          )}
        </div>
      )}

      <div className="flex gap-3 mt-4">
        {isEditing ? (
          <>
            <button
              onClick={() => onSaveEdit(task.id)}
              className="text-blue-600 text-xl"
              title="Save changes"
            >
              <FaSave />
            </button>
            <button
              onClick={onCancelEdit}
              className="text-gray-600 text-xl"
              title="Cancel edit"
            >
              <FaTimes />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onEdit(task)}
              className="text-yellow-600 text-xl"
              title="Edit task"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => onComplete(task.id)}
              disabled={task.completed}
              className={`text-xl ${
                task.completed
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-green-600"
              }`}
              title={task.completed ? "Already completed" : "Mark complete"}
            >
              <FaCheckCircle />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-600 text-xl"
              title="Delete task"
            >
              <FaTrash />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
