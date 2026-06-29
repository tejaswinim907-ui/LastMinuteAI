import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-blue-700 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">🚀 LastMinute AI</h1>

      <nav className="space-y-4">
        <Link to="/" className="block hover:text-yellow-300">🏠 Dashboard</Link>
        <Link to="/tasks" className="block hover:text-yellow-300">📋 Tasks</Link>
        <Link to="/planner" className="block hover:text-yellow-300">🤖 AI Planner</Link>
        <Link to="/calendar" className="block hover:text-yellow-300">📅 Calendar</Link>
        <Link to="/analytics" className="block hover:text-yellow-300">📈 Analytics</Link>
        <Link to="/settings" className="block hover:text-yellow-300">⚙️ Settings</Link>
      </nav>
    </div>
  );
}

export default Sidebar;