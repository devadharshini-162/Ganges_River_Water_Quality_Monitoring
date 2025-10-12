import React from "react";
import { Droplet } from "lucide-react";

interface PollutionData {
  main: {
    aqi: number;
  };
  components: {
    pm2_5: number;
    pm10: number;
    no2: number;
    o3: number;
    co: number;
    so2: number;
    no?: number;
    nh3?: number;
  };
  dt: number;
  pollutionRate?: string;
  cause?: string;
}


interface Props {
  data: PollutionData | null;
}


const aqiLevels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

const PollutionCard: React.FC<Props> = ({ data }) => {
  if (!data) return <p>Loading pollution data...</p>;

  // BEFORE: const { aqi, components, pollutionRate, cause } = data;
const { main, components, pollutionRate, cause } = data;
const aqi = main.aqi; // <--- Access 'aqi' from 'main'
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full md:w-1/2 text-gray-800">
      <h2 className="text-lg font-semibold mb-2">Air Quality Index</h2>
      <p className="text-3xl font-bold text-blue-600">{aqiLevels[aqi - 1]}</p>

      <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
        <p>PM2.5: {components.pm2_5} µg/m³</p>
        <p>PM10: {components.pm10} µg/m³</p>
        <p>NO₂: {components.no2} µg/m³</p>
        <p>O₃: {components.o3} µg/m³</p>
        <p>CO: {components.co} µg/m³</p>
        <p>SO₂: {components.so2} µg/m³</p>
      </div>

      {/* Pollution Summary */}
      <div className="bg-purple-50 rounded-lg shadow p-3 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Droplet className="w-5 h-5 text-purple-600" />
          <h4 className="font-bold text-gray-800">Pollution Summary</h4>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Pollution Rate:</span>
            <span className="font-medium text-purple-700">{pollutionRate || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span>Likely Cause:</span>
            <span className="font-medium text-purple-700">{cause || "Unknown"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollutionCard;
