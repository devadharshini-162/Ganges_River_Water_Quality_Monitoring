import { Waypoint } from '../types/mission';
import { Database, MapPin } from 'lucide-react';

interface DataTableProps {
  waypoints: Waypoint[];
  onRowClick: (waypointId: number) => void;
}

export default function DataTable({ waypoints, onRowClick }: DataTableProps) {
  const completedWaypoints = waypoints.filter((wp) => wp.status === 'completed');

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full overflow-auto">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Sampling Data</h2>
      </div>

      {completedWaypoints.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No samples collected yet</p>
          <p className="text-sm">Start the mission to begin sampling</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 px-2 font-semibold text-gray-700">WP</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">Temp (°C)</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">pH</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">Turbidity</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">State</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">Bottle ID</th>
              </tr>
            </thead>
            <tbody>
              {completedWaypoints.map((waypoint) => (
                <tr
                  key={waypoint.id}
                  onClick={() => onRowClick(waypoint.id)}
                  className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-2 font-medium text-gray-900">{waypoint.id}</td>
                  <td className="py-3 px-2 text-gray-700">
                    {waypoint.sensorData?.temperature.toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-gray-700">
                    {waypoint.sensorData?.ph.toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-gray-700">
                    {waypoint.sensorData?.turbidity.toFixed(2)}
                  </td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      {waypoint.droneState}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-600 text-xs font-mono">
                    {waypoint.bottleId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p>
            <span className="font-semibold">Total Samples:</span> {completedWaypoints.length} / {waypoints.length}
          </p>
        </div>
      </div>
    </div>
  );
}
