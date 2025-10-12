import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Waypoint } from '../types/mission';
import 'leaflet/dist/leaflet.css';
import droneImg from '../assets/drone.png';

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const createDroneIcon = () => {
  return L.icon({
    className: 'drone-marker',
    iconUrl: droneImg,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const getMarkerColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return '#10b981';
    case 'current':
      return '#ef4444';
    case 'remaining':
      return '#3b82f6';
    default:
      return '#6b7280';
  }
};

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

interface MapViewProps {
  waypoints: Waypoint[];
  dronePosition: [number, number] | null;
  selectedWaypoint: number | null;
  onWaypointClick: (waypointId: number) => void;
}

export default function MapView({
  waypoints,
  dronePosition,
  selectedWaypoint,
  onWaypointClick,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);

  const center: [number, number] = selectedWaypoint
    ? [
        waypoints.find((w) => w.id === selectedWaypoint)?.latitude || waypoints[0].latitude,
        waypoints.find((w) => w.id === selectedWaypoint)?.longitude || waypoints[0].longitude,
      ]
    : [waypoints[0].latitude, waypoints[0].longitude];

  const pathCoordinates: [number, number][] = waypoints.map((wp) => [wp.latitude, wp.longitude]);

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
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

      <Polyline positions={pathCoordinates} color="#3b82f6" weight={2} opacity={0.6} />

 
      {waypoints.map((waypoint) => (
        <Marker
          key={waypoint.id}
          position={[waypoint.latitude, waypoint.longitude]}
          icon={createCustomIcon(getMarkerColor(waypoint.status))}
          eventHandlers={{
            click: () => {
              if (waypoint.status === 'completed') {
                onWaypointClick(waypoint.id);
              }
            },
          }}
        />
      ))}

      {dronePosition && (
  <Marker position={dronePosition} icon={createDroneIcon()} />
)}



      <MapController center={center} />
    </MapContainer>
  );
}
