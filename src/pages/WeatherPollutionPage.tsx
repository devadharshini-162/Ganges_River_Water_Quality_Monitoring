import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// NOTE: These API functions must be defined in their respective files
import { fetchWeather } from "../api/weatherAPI"; 
import { fetchPollutionData } from "../api/pollutionAPI";
import Navigation from "../components/Navigation";
import { ChevronDown, ChevronUp, Cloud as CloudIcon, Droplet } from "lucide-react";

interface ManualWaypoint {
  latitude: number;
  longitude: number;
  stationId: number; // Include stationId for context when passed from WaypointSetupPage
}

interface LocationState {
  lat?: number;
  lon?: number;
  waypoints?: ManualWaypoint[];
  bodyName?: string; 
}

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


export default function WeatherPollutionPage() {
  const location = useLocation();
  const { lat, lon, waypoints, bodyName } = (location.state as LocationState) || {};

  const [weather, setWeather] = useState<any[]>([]);
  const [pollution, setPollution] = useState<PollutionData[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  /**
   * Generates a simplified summary based on component thresholds.
   */
  const getPollutionSummary = (pollData: PollutionData) => {
    // Check for required data structure
    if (!pollData || !pollData.components) return { rate: "N/A", cause: "Unknown" };

    const { pm2_5, pm10, no2, o3, co, so2 } = pollData.components; 
    let rate = "Low";
    
    // Simplified health thresholds for demo purposes
    if (pm2_5 > 50 || pm10 > 80 || no2 > 50 || o3 > 100 || co > 200 || so2 > 50) {
      rate = "High";
    } else if (pm2_5 > 25 || pm10 > 50) {
      rate = "Moderate";
    }

    let cause = "Other / General";
    if (co > 200 || no2 > 40) cause = "Traffic & Emissions";
    else if (so2 > 30) cause = "Industrial Activity";
    
    if (bodyName) {
      cause = `${cause} near ${bodyName}`;
    }

    return { rate, cause };
  };


  useEffect(() => {
    const loadData = async () => {
      // Clear previous data and show loading state
      setWeather([]);
      setPollution([]);

      try {
        let targets: { latitude: number, longitude: number, stationId: number }[] = [];

        if (waypoints && waypoints.length > 0) {
          // If waypoints exist (from 'Check Weather for All Waypoints')
          targets = waypoints.map((wp: any) => ({
            latitude: wp.latitude,
            longitude: wp.longitude,
            stationId: wp.stationId,
          }));
        } else if (lat != null && lon != null) {
          // Otherwise, use single lat/lon pair (from 'Check Weather & Pollution' button)
          targets = [{ latitude: lat, longitude: lon, stationId: 1 }];
        } else {
          // Fallback to default location
          targets = [{ latitude: 25.3176, longitude: 82.9739, stationId: 1 }]; 
        }

        const results = await Promise.all(
          targets.map(async (target) => {
            // Fetch data concurrently for each target
            const weatherData = await fetchWeather(target.latitude, target.longitude);
            let pollutionData = await fetchPollutionData(target.latitude, target.longitude);
            
            const summary = getPollutionSummary(pollutionData);
            
            // Augment pollution data with summary fields
            pollutionData = { 
              ...pollutionData, 
              pollutionRate: summary.rate, 
              cause: summary.cause,
            }; 
            
            return { weatherData, pollutionData, stationId: target.stationId };
          })
        );
        
        // Separate results into state arrays
        setWeather(results.map(r => r.weatherData));
        setPollution(results.map(r => r.pollutionData));

      } catch (err) {
        console.error("Error loading weather/pollution data:", err);
      }
    };
    loadData();
  }, [lat, lon, waypoints, bodyName]); // Dependencies for re-running effect

  const toggleCard = (index: number) => setExpandedIndex(expandedIndex === index ? null : index);

  const renderCard = (data: any, polData: PollutionData, index: number) => (
    <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleCard(index)}>
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">{index + 1}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Waypoint {index + 1}</h3>
             <p className="text-sm text-gray-500">
               Lat: {data?.coord?.lat?.toFixed(6) ?? "N/A"}, Lon: {data?.coord?.lon?.toFixed(6) ?? "N/A"}
             </p>
          </div>
        </div>
        {expandedIndex === index ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </div>

      {expandedIndex === index && (
        <div className="p-6 border-t border-gray-200 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weather */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-4"><CloudIcon className="w-5 h-5 text-blue-600" /><h4 className="font-bold text-gray-800">Weather Forecast</h4></div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Temperature:</span><span className="font-medium">{data?.main?.temp?.toFixed(2) ?? "N/A"} °C</span></div>
              <div className="flex justify-between"><span>Humidity:</span><span className="font-medium">{data?.main?.humidity ?? "N/A"} %</span></div>
              <div className="flex justify-between"><span>Condition:</span><span className="font-medium">{data?.weather?.[0]?.description ?? "N/A"}</span></div>
              <div className="flex justify-between"><span>Wind Speed:</span><span className="font-medium">{data?.wind?.speed ?? "N/A"} m/s</span></div>
              <div className="flex justify-between"><span>Wind Direction:</span><span className="font-medium">{data?.wind?.deg ?? "N/A"}°</span></div>
            </div>
          </div>

          {/* Pollution */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-4"><Droplet className="w-5 h-5 text-purple-600" /><h4 className="font-bold text-gray-800">Air Quality Index (AQI)</h4></div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b pb-2 mb-2">
                <span className="font-semibold">Overall Rate:</span>
                <span className={`font-bold text-lg ${
                    polData?.pollutionRate === 'High' ? 'text-red-600' : 
                    polData?.pollutionRate === 'Moderate' ? 'text-orange-500' : 
                    'text-green-600'
                }`}>
                    {polData?.pollutionRate ?? "N/A"}
                </span>
              </div>
              <div className="flex justify-between"><span>Likely Cause:</span><span className="font-medium text-purple-700">{polData?.cause ?? "Unknown"}</span></div>
              
              {/* Individual Pollutants */}
              <div className="pt-2">
                <p className="font-semibold text-gray-700 mb-1">Concentrations (µg/m³):</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>PM2.5:</span>
                    <span className="font-medium">
                      {polData?.components?.pm2_5 != null ? polData.components.pm2_5.toFixed(2) : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>PM10:</span>
                    <span className="font-medium">
                      {polData?.components?.pm10 != null ? polData.components.pm10.toFixed(2) : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>NO₂:</span>
                    <span className="font-medium">
                      {polData?.components?.no2 != null ? polData.components.no2.toFixed(2) : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>O₃:</span>
                    <span className="font-medium">
                      {polData?.components?.o3 != null ? polData.components.o3.toFixed(2) : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>CO (Carbon Monoxide):</span>
                    <span className="font-medium">
                      {polData?.components?.co != null ? polData.components.co.toFixed(2) : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>SO₂ (Sulfur Dioxide):</span>
                    <span className="font-medium">
                      {polData?.components?.so2 != null ? polData.components.so2.toFixed(2) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Weather & Pollution Data
            {bodyName && <p className="text-xl font-medium text-blue-600 mt-1">for {bodyName}</p>}
        </h1>
        {weather.length === 0 || pollution.length === 0 ? (
          <div className="text-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Fetching data for waypoint(s)...</p>
          </div>
        ) : (
          weather.map((w, i) => renderCard(w, pollution[i], i))
        )}
      </div>
    </div>
  );
}
