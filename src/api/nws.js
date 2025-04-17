// src/api/nws.js
export async function getGridpoint(lat, lon) {
    const res = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
    return res.json();
  }
  
  export async function getForecastAndAlerts(lat, lon) {
    const { properties } = await getGridpoint(lat, lon);
    const [fcR, alR] = await Promise.all([
      fetch(properties.forecast).then(r=>r.json()),
      fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`).then(r=>r.json())
    ]);
    return {
      periods: fcR.properties.periods,
      alerts: alR.features
    };
  }
  