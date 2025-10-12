import React from "react";

interface WeatherCardProps {
  data: any;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  if (!data) return <div>Loading weather...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
      <h2 className="text-xl font-bold mb-2 text-gray-800">Weather Data</h2>
      <p>Temperature: {data.main?.temp} °C</p>
      <p>Humidity: {data.main?.humidity} %</p>
      <p>Condition: {data.weather?.[0]?.description}</p>
      <p>Wind Speed: {data.wind?.speed} m/s</p>
      <p>Wind Direction: {data.wind?.deg}°</p>
      {data.wind?.gust && <p>Gust: {data.wind.gust} m/s</p>}
    </div>
  );
};

export default WeatherCard;
