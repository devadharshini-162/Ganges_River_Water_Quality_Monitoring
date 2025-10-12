import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Waves, Plane } from 'lucide-react';
import bgImg from '../assets/ganga2.jpg'; //

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bgImg})`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <div className="flex items-center gap-4 mb-6 animate-fade-in">
          <Plane className="w-16 h-16" />
          <Waves className="w-16 h-16" />
        </div>

        <h1 className="text-6xl font-bold mb-4 text-center animate-fade-in-delay-1">
          Ganga Water Sampling Mission
        </h1>

        <p className="text-xl mb-12 text-center max-w-2xl animate-fade-in-delay-2 text-gray-200">
          Autonomous drone-based water quality monitoring along the sacred Ganges River
        </p>

        <button
          onClick={() => navigate('/waypoint-setup')}
          className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 animate-fade-in-delay-3"
        >
          Start Mission
        </button>

        <div className="absolute bottom-8 text-sm text-gray-300 animate-fade-in-delay-4">
          Environmental Monitoring System v1.0
        </div>
        </div>
      </div>
    </div>
  );
}
