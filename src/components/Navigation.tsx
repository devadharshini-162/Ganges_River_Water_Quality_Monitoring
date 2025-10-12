import { Link, useLocation } from "react-router-dom";
import { Home, MapPin, Database, Settings, Cloud } from "lucide-react";

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Ganga Water Monitoring</h1>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/") ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              to="/waypoint-setup"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/waypoint-setup")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="font-medium">Setup Waypoints</span>
            </Link>

            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/dashboard")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Mission Control</span>
            </Link>

            <Link
              to="/sensor-data"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/sensor-data")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Database className="w-4 h-4" />
              <span className="font-medium">Sensor Data</span>
            </Link>

            {/* ✅ New Navigation Link for Weather & Pollution */}
            <Link
              to="/weather-pollution"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/weather-pollution")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span className="font-medium">Weather & Pollution</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
