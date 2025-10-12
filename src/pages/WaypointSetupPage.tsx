import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import Navigation from '../components/Navigation';
import { WaterBodyType, ManualWaypoint } from '../types/waterBody';
import { Droplet, Waves, MapPin, Plus, Trash2, Play } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const createWaypointIcon = (number: number) => {
  return L.divIcon({
    className: 'custom-waypoint-marker',
    html: `<div style="background-color: #3b82f6; color: white; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">${number}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function WaypointSetupPage() {
  const navigate = useNavigate();
  const [waterBodyType, setWaterBodyType] = useState<WaterBodyType>('river-stretch');
  const [waypoints, setWaypoints] = useState<ManualWaypoint[]>([]);
  const [waterBodyName, setWaterBodyName] = useState('');
  const [description, setDescription] = useState('');

  const handleMapClick = (lat: number, lng: number) => {
    setWaypoints([...waypoints, { latitude: lat, longitude: lng }]);
  };

  const removeWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const handleStartMission = () => {
    if (waypoints.length === 0) {
      alert('Please add at least one waypoint');
      return;
    }

    navigate('/dashboard', {
      state: {
        waypoints,
        waterBodyType,
        waterBodyName,
        description,
      },
    });
  };

  const waterBodyOptions = [
    { value: 'drain', label: 'Drains', icon: Droplet, color: 'bg-amber-500' },
    { value: 'river-stretch', label: 'River Stretch', icon: Waves, color: 'bg-blue-500' },
    { value: 'lake', label: 'Lakes', icon: MapPin, color: 'bg-teal-500' },
    { value: 'other', label: 'Other Water Bodies', icon: Droplet, color: 'bg-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mission Configuration</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Water Body Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {waterBodyOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setWaterBodyType(option.value as WaterBodyType)}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        waterBodyType === option.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`${option.color} p-2 rounded-lg text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-sm">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Water Body Name
              </label>
              <input
                type="text"
                value={waterBodyName}
                onChange={(e) => setWaterBodyName(e.target.value)}
                placeholder="e.g., Ganga - Varanasi Section"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes about the sampling location..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Plus className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Click on the map to add waypoints</p>
                <p className="text-sm text-blue-700 mt-1">
                  Each click will add a new sampling location. The drone will visit them in order.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
              <MapContainer
                center={[25.3176, 82.9739]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={19}
                />
                <TileLayer
                  attribution=''
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={19}
                />

                <MapClickHandler onMapClick={handleMapClick} />

                {waypoints.map((wp, index) => (
                  <Marker
                    key={index}
                    position={[wp.latitude, wp.longitude]}
                    icon={createWaypointIcon(index + 1)}
                  />
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Waypoints ({waypoints.length})
            </h3>

            {waypoints.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No waypoints added</p>
                <p className="text-sm">Click on the map to add</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                {waypoints.map((wp, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div key={index} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium text-gray-800">Waypoint {index + 1}</p>
      <p className="text-xs text-gray-600">
        {wp.latitude.toFixed(6)}, {wp.longitude.toFixed(6)}
      </p>
    </div>
    <button
      onClick={() => removeWaypoint(index)}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>

  <button
    onClick={() =>
      navigate("/weather-pollution", {
        state: { lat: wp.latitude, lon: wp.longitude },
      })
    }
    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
  >
    <Droplet className="w-4 h-4" />
    Check Weather & Pollution
  </button>
</div>

                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => setWaypoints([])}
                disabled={waypoints.length === 0}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All
              </button>

              <button
                onClick={handleStartMission}
                disabled={waypoints.length === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                Start Mission
              </button>

              <button
  onClick={() =>
    navigate("/weather-pollution", {
      state: { waypoints },
    })
  }
  disabled={waypoints.length === 0}
  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
>
  <Droplet className="w-5 h-5" />
  Check Weather for All Waypoints
</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
