import React, { useState, useEffect } from 'react';
import LocationSelector from './components/LocationSelector';
import AlertsBanner from './components/AlertsBanner';
import WeatherPeriod from './components/WeatherPeriod';
import { getForecastAndAlerts } from './api/nws';

export default function App() {
  const [coords, setCoords] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Sync dark mode class
  useEffect(() => {
    const root = document.documentElement;
    darkMode ? root.classList.add('dark') : root.classList.remove('dark');
  }, [darkMode]);

  // Fetch forecast when coords change
  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    setError('');
    getForecastAndAlerts(coords.lat, coords.lon)
      .then(({ periods, alerts }) => {
        setPeriods(periods);
        setAlerts(alerts);
      })
      .catch(() => setError('Unable to fetch data'))
      .finally(() => setLoading(false));
  }, [coords]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-900 shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-300">
            US Weather & Alerts
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-6">
        {/* Location Card with Manual Input & Geo */}
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <span className="mr-2">📍</span> Select Location (manual or use device)
          </h2>
          <LocationSelector onSelect={setCoords} />
        </div>

        {loading && (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500">
            {error}
          </p>
        )}

        {coords && !loading && !error && (
          <>
            <AlertsBanner alerts={alerts} />

            <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Forecast
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {periods.map((p) => (
                  <div key={p.number} className="transition transform hover:scale-105">
                    <WeatherPeriod period={p} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="text-center p-4 text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} US Weather & Alerts
      </footer>
    </div>
  );
}
