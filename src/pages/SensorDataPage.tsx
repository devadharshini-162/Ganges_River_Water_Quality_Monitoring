import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Waypoint } from '../types/mission';
import { MapPin, Thermometer, Package, Lock, Hash, Eye, ChevronDown, ChevronUp } from 'lucide-react';

export default function SensorDataPage() {
  const navigate = useNavigate();
  const { waypointId } = useParams<{ waypointId: string }>();
  const [allWaypoints, setAllWaypoints] = useState<Waypoint[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');
  const [expandedWaypoint, setExpandedWaypoint] = useState<number | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('missionWaypoints');
    if (storedData) {
      const waypoints = JSON.parse(storedData) as Waypoint[];
      const completed = waypoints.filter((wp) => wp.status === 'completed');
      setAllWaypoints(completed);

      if (waypointId) {
        setViewMode('single');
        setExpandedWaypoint(Number(waypointId));
      }
    }
  }, [waypointId]);

  const completedWaypoints = allWaypoints.filter((wp) => wp.status === 'completed');

  const toggleWaypoint = (id: number) => {
    setExpandedWaypoint(expandedWaypoint === id ? null : id);
  };

  const WaypointDetailCard = ({ waypoint, isExpanded }: { waypoint: Waypoint; isExpanded: boolean }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => toggleWaypoint(waypoint.id)}
      >
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
            {waypoint.id}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Waypoint {waypoint.id}</h3>
            <p className="text-sm text-gray-600">
              {waypoint.timestamp ? new Date(waypoint.timestamp).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">Bottle ID</div>
            <div className="text-xs font-mono text-gray-900">{waypoint.bottleId}</div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-gray-800">Location</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Latitude:</span>
                  <span className="font-medium">{waypoint.latitude.toFixed(6)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longitude:</span>
                  <span className="font-medium">{waypoint.longitude.toFixed(6)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Altitude:</span>
                  <span className="font-medium">{waypoint.altitude} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Station ID:</span>
                  <span className="font-medium font-mono">{waypoint.stationId}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 mb-4">
                <Thermometer className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-gray-800">Sensor Readings</h4>
              </div>
              <div className="space-y-3">
                <div className="bg-red-50 rounded p-3">
                  <div className="text-xs text-gray-600">Temperature</div>
                  <div className="text-2xl font-bold text-red-600">
                    {waypoint.sensorData?.temperature.toFixed(2)} °C
                  </div>
                </div>
                <div className="bg-green-50 rounded p-3">
                  <div className="text-xs text-gray-600">pH Level</div>
                  <div className="text-2xl font-bold text-green-600">
                    {waypoint.sensorData?.ph.toFixed(2)}
                  </div>
                </div>
                <div className="bg-blue-50 rounded p-3">
                  <div className="text-xs text-gray-600">Turbidity</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {waypoint.sensorData?.turbidity.toFixed(2)} NTU
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-purple-600" />
                <h4 className="font-bold text-gray-800">Sample Info</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bottle ID:</span>
                  <span className="font-medium font-mono text-xs">{waypoint.bottleId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume:</span>
                  <span className="font-medium">{waypoint.sampleVolume} ml</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sealed:</span>
                  <span className={`flex items-center gap-1 font-medium ${waypoint.sealed ? 'text-green-600' : 'text-red-600'}`}>
                    <Lock className="w-3 h-3" />
                    {waypoint.sealed ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operator:</span>
                  <span className="font-medium font-mono">{waypoint.operatorId}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-orange-600" />
                <h4 className="font-bold text-gray-800">Metadata</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">State:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    {waypoint.droneState}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1 mb-1">
                    <Hash className="w-3 h-3 text-gray-600" />
                    <span className="text-gray-600 text-xs">Chain of Custody:</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded font-mono text-xs text-gray-700 break-all">
                    {waypoint.chainOfCustodyHash}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg shadow p-4">
            <h4 className="font-bold text-gray-800 mb-2 text-sm">Raw JSON Data</h4>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
              <code>
                {JSON.stringify(
                  {
                    waypointId: waypoint.id,
                    location: {
                      latitude: waypoint.latitude,
                      longitude: waypoint.longitude,
                      altitude: waypoint.altitude,
                    },
                    sensorData: waypoint.sensorData,
                    metadata: {
                      timestamp: waypoint.timestamp,
                      droneState: waypoint.droneState,
                      sealed: waypoint.sealed,
                      bottleId: waypoint.bottleId,
                      sampleVolume: waypoint.sampleVolume,
                      stationId: waypoint.stationId,
                      operatorId: waypoint.operatorId,
                      chainOfCustodyHash: waypoint.chainOfCustodyHash,
                    },
                  },
                  null,
                  2
                )}
              </code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Sensor Data Collection</h1>
              <p className="text-gray-600 mt-1">
                {completedWaypoints.length} sample{completedWaypoints.length !== 1 ? 's' : ''} collected
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setViewMode('all');
                  setExpandedWaypoint(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Samples
              </button>
            </div>
          </div>
        </div>

        {completedWaypoints.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Samples Collected Yet</h2>
            <p className="text-gray-600 mb-6">Start a mission to begin collecting water samples</p>
            <button
              onClick={() => navigate('/waypoint-setup')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Setup Mission
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {completedWaypoints.map((waypoint) => (
              <WaypointDetailCard
                key={waypoint.id}
                waypoint={waypoint}
                isExpanded={expandedWaypoint === waypoint.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
