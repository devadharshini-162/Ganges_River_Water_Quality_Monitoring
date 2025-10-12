
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';

interface Props {
  pollutionData: any[];
}

export default function PollutionMapOverlay({ pollutionData }: Props) {
  const center: [number, number] = [25.3, 82.9]; // Approx Ganges

  return (
    <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {pollutionData?.map((p: any, idx: number) => (
        <CircleMarker
          key={idx}
          center={[p.lat, p.lon]}
          radius={10}
          color="#ef4444"
          fillOpacity={0.5}
        />
      ))}
    </MapContainer>
  );
}
