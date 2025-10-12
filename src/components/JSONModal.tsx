import { X } from 'lucide-react';
import { Waypoint } from '../types/mission';

interface JSONModalProps {
  isOpen: boolean;
  onClose: () => void;
  waypoints: Waypoint[];
}

export default function JSONModal({ isOpen, onClose, waypoints }: JSONModalProps) {
  if (!isOpen) return null;

  const completedWaypoints = waypoints.filter((wp) => wp.status === 'completed');

  const jsonPayload = {
    mission: 'Ganga Water Sampling',
    totalWaypoints: waypoints.length,
    completedSamples: completedWaypoints.length,
    samples: completedWaypoints.map((wp) => ({
      waypointId: wp.id,
      location: {
        latitude: wp.latitude,
        longitude: wp.longitude,
        altitude: wp.altitude,
      },
      sensorData: wp.sensorData,
      metadata: {
        timestamp: wp.timestamp,
        droneState: wp.droneState,
        sealed: wp.sealed,
        bottleId: wp.bottleId,
        sampleVolume: wp.sampleVolume,
        stationId: wp.stationId,
        operatorId: wp.operatorId,
        chainOfCustodyHash: wp.chainOfCustodyHash,
      },
    })),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Mission Data JSON</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{JSON.stringify(jsonPayload, null, 2)}</code>
          </pre>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(jsonPayload, null, 2));
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Copy to Clipboard
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
