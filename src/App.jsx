// src/App.jsx
import React, { useState, useEffect } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import LocationSelector from "./components/LocationSelector";
import AlertsBanner from "./components/AlertsBanner";
import WeatherPeriod from "./components/WeatherPeriod";
import { getForecastAndAlerts } from "./api/nws";
import { convertTemp } from "./utils/temperature";

const STORAGE_KEY = "uswa-location";

export default function App() {
  // location: { lat, lon, name }
  const [location, setLocation] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [unit, setUnit] = useState("F");
  const [menuOpen, setMenuOpen] = useState(false);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLocation(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Persist location to localStorage whenever it changes
  useEffect(() => {
    if (location) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    }
  }, [location]);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    darkMode ? root.classList.add("dark") : root.classList.remove("dark");
  }, [darkMode]);

  // Fetch forecast when location changes
  useEffect(() => {
    if (!location) return;
    setLoading(true);
    setError("");
    getForecastAndAlerts(location.lat, location.lon)
      .then(({ periods, alerts }) => {
        setPeriods(periods);
        setAlerts(alerts);
      })
      .catch(() => setError("Unable to fetch data"))
      .finally(() => setLoading(false));
  }, [location]);

  // Render current time string
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Toggle between 'F' and 'C'
  function toggleUnit() {
    setUnit((prev) => (prev === "F" ? "C" : "F"));
  }

  // Clear saved location to allow re-select
  function resetLocation() {
    localStorage.removeItem(STORAGE_KEY);
    setLocation(null);
    setPeriods([]);
    setAlerts([]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md">
        <div className="container mx-auto p-4 flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-300">
            US Weather & Alerts
          </h1>

          {/* Desktop controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* °F/°C Toggle */}
            <button
              onClick={toggleUnit}
              className={`px-4 py-1 rounded-full font-semibold transition ${
                unit === "F"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {unit === "F" ? "°F" : "°C"}
            </button>

            {/* Change Location */}
            {location && (
              <button
                onClick={resetLocation}
                className="px-3 py-1 border rounded bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-600 transition"
              >
                Change Location
              </button>
            )}

            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <XIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2 p-4">
              <button
                onClick={toggleUnit}
                className={`w-full text-left px-4 py-2 rounded-full font-semibold transition ${
                  unit === "F"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {unit === "F" ? "Switch to °C" : "Switch to °F"}
              </button>

              {location && (
                <button
                  onClick={resetLocation}
                  className="w-full text-left px-4 py-2 border rounded bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-600 transition"
                >
                  Change Location
                </button>
              )}

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-full text-left px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 space-y-6">
        {/* Top section: Current Weather & Location Selector */}
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          {/* Current Weather */}
          {location && periods.length > 0 && !loading && !error && (
            <section className="flex-1 max-w-md lg:max-w-none mx-auto lg:mx-0 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <span className="mr-2">🌦️</span> Current Weather
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {location.name || "Current Location"} · {currentTime}
                </div>
              </div>
              <WeatherPeriod period={periods[0]} unit={unit} />
            </section>
          )}

          {/* Location Selector */}
          <div className="flex-1 max-w-md lg:max-w-none mx-auto lg:mx-0">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <span className="mr-2">📍</span> Select Location
              </h2>
              <LocationSelector onSelect={(loc) => setLocation(loc)} />
            </div>
          </div>
        </div>

        {/* Loading & Error */}
        {loading && (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Alerts */}
        {location && alerts.length > 0 && !loading && !error && (
          <AlertsBanner alerts={alerts} />
        )}

        {/* 7-Day Forecast (unchanged) */}
        {location && periods.length > 0 && !loading && !error && (
          <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              7-Day Forecast
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {periods.map((p) => (
                <div
                  key={p.number}
                  className="transition transform hover:scale-105 h-80"
                >
                  <WeatherPeriod period={p} unit={unit} className="h-full" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center p-4 text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} US Weather & Alerts
      </footer>
    </div>
  )}
