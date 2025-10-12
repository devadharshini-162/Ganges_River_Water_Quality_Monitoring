import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import MapView from '../components/MapView';
import DataTable from '../components/DataTable';
import Charts from '../components/Charts';
import JSONModal from '../components/JSONModal';
import { useDroneSimulation } from '../hooks/useDroneSimulation';
import { GANGA_WAYPOINTS } from '../data/sampleData';
import { Waypoint } from '../types/mission';
import { Play, Pause, FileJson } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setupData = location.state;

  const initialWaypointsFromSetup: Waypoint[] = setupData?.waypoints && Array.isArray(setupData.waypoints)
  ? setupData.waypoints.map((wp: any, index: number) => ({
      id: index + 1,
      latitude: wp.latitude,
      longitude: wp.longitude,
      altitude: 85,
      status: 'remaining' as const,
      stationId: `${setupData.waterBodyType?.toUpperCase() || 'WB'}-${(index + 1)
        .toString()
        .padStart(3, '0')}`,
      operatorId: 'OP-Alpha',
    }))
  : GANGA_WAYPOINTS;

const [initialWaypoints] = useState<Waypoint[]>(initialWaypointsFromSetup);

  const {
    waypoints,
    dronePosition,
    droneState,
    isSimulating,
    startSimulation,
    stopSimulation,
  } = useDroneSimulation(initialWaypoints.length > 0 ? initialWaypoints : GANGA_WAYPOINTS);

  const [selectedWaypoint, setSelectedWaypoint] = useState<number | null>(null);
  const [showJSONModal, setShowJSONModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('missionWaypoints', JSON.stringify(waypoints));
  }, [waypoints]);

  const handleWaypointClick = (waypointId: number) => {
    navigate(`/sensor-data/${waypointId}`);
  };

  if (initialWaypoints.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-600">Loading mission data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <div className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mission Control Dashboard</h1>
            {setupData?.waterBodyName && (
              <p className="text-sm text-gray-600 mt-1">
                {setupData.waterBodyName} - {setupData.waterBodyType}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-gray-100 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Drone Status: </span>
              <span className={`text-sm font-bold ${
                droneState === 'Idle' ? 'text-gray-600' :
                droneState === 'Flying' ? 'text-blue-600' :
                droneState === 'Sampling' ? 'text-green-600' :
                droneState === 'Returning' ? 'text-orange-600' :
                'text-purple-600'
              }`}>
                {droneState}
              </span>
            </div>

            <select
              value={selectedWaypoint || ''}
              onChange={(e) => setSelectedWaypoint(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Waypoint</option>
              {waypoints.map((wp) => (
                <option key={wp.id} value={wp.id}>
                  Waypoint {wp.id} ({wp.status})
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowJSONModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FileJson className="w-4 h-4" />
              View JSON
            </button>

            {!isSimulating ? (
              <button
                onClick={startSimulation}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                <Play className="w-4 h-4" />
                Start Mission
              </button>
            ) : (
              <button
                onClick={stopSimulation}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
          <MapView
            waypoints={waypoints}
            dronePosition={dronePosition}
            selectedWaypoint={selectedWaypoint}
            onWaypointClick={handleWaypointClick}
          />
        </div>

        <div className="col-span-4 space-y-6">
          <div style={{ height: '280px' }}>
            <DataTable waypoints={waypoints} onRowClick={handleWaypointClick} />
          </div>
          <div style={{ height: '300px' }}>
            <Charts waypoints={waypoints} />
          </div>
        </div>
      </div>

      <JSONModal
        isOpen={showJSONModal}
        onClose={() => setShowJSONModal(false)}
        waypoints={waypoints}
      />
    </div>
  );
}
