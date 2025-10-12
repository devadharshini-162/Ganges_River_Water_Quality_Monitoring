import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import WaypointSetupPage from './pages/WaypointSetupPage';
import DashboardPage from './pages/DashboardPage';
import SensorDataPage from './pages/SensorDataPage';
import WeatherPollutionPage from './pages/WeatherPollutionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/waypoint-setup" element={<WaypointSetupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sensor-data" element={<SensorDataPage />} />
        <Route path="/sensor-data/:waypointId" element={<SensorDataPage />} />
        <Route path="/weather-pollution" element={<WeatherPollutionPage />} />
      </Routes>
    </Router>
  );
}


export default App;
