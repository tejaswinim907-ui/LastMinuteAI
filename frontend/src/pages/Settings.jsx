import { useTheme } from "../context/ThemeContext";

function Settings() {
  const { theme, setTheme, displayName, setDisplayName } = useTheme();

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <p className="text-gray-600 mb-6">
        Personalize the app name and appearance.
      </p>

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <label className="block font-semibold mb-2" htmlFor="display-name">
            Your Name
          </label>
          <input
            id="display-name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Enter your name"
          />
        </div>

        <div className="flex items-center justify-between border rounded-lg p-4">
          <div>
            <h2 className="font-semibold">Theme</h2>
            <p className="text-sm text-gray-500">Switch between light and dark mode.</p>
          </div>

          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            className="border rounded p-2"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Settings;