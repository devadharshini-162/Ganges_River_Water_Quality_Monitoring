import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Waypoint } from '../types/mission';
import { Activity } from 'lucide-react';

interface ChartsProps {
  waypoints: Waypoint[];
}

export default function Charts({ waypoints }: ChartsProps) {
  const completedWaypoints = waypoints.filter((wp) => wp.status === 'completed');

  const chartData = completedWaypoints.map((wp) => ({
    name: `WP${wp.id}`,
    temperature: wp.sensorData?.temperature || 0,
    ph: wp.sensorData?.ph || 0,
    turbidity: wp.sensorData?.turbidity || 0,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No data available for charts</p>
          <p className="text-sm">Charts will update as samples are collected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-6 overflow-auto">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Sensor Analytics</h2>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Temperature (°C)</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip />
            <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">pH Level</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 14]} />
            <Tooltip />
            <Line type="monotone" dataKey="ph" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Turbidity (NTU)</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip />
            <Line type="monotone" dataKey="turbidity" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
