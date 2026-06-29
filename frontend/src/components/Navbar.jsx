function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">

        <h1 className="text-2xl font-bold">
          🤖 LastMinute AI
        </h1>

        <div className="space-x-6">
          <button className="hover:text-yellow-300">
            Dashboard
          </button>

          <button className="hover:text-yellow-300">
            Tasks
          </button>

          <button className="hover:text-yellow-300">
            Analytics
          </button>

          <button className="hover:text-yellow-300">
            Settings
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;