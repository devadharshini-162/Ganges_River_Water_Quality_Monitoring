// src/api/pollutionAPI.ts
export const fetchPollutionData = async (lat: number, lon: number) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch pollution data");
    const data = await res.json();
    return data.list[0];
  } catch (err) {
    console.error("Pollution API error:", err);
    return null;
  }
};
