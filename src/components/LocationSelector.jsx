// src/components/LocationSelector.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function LocationSelector({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  // Browser geolocation with reverse lookup
  const askGeo = () =>
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const lat = coords.latitude;
        const lon = coords.longitude;
        let name = '';
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
          const res = await fetch(url);
          const data = await res.json();
          const addr = data.address || {};
          name = addr.city || addr.town || addr.village || data.display_name;
        } catch (err) {
          console.error('Reverse geocode error:', err);
        }
        // clear any manual input
        setQuery('');
        setSuggestions([]);
        onSelect({ lat, lon, name });
      },
      () => console.warn('Geolocation denied'),
      { enableHighAccuracy: true }
    );

  // Debounced autocomplete
  useEffect(() => {
    if (query.length < 3) {
      // clear when too short
      setSuggestions([]);
      return;
    }

    // clear any existing debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // set a new debounce timer
    debounceRef.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
          query
        )}&country=USA&limit=5&format=json`;
        const res = await fetch(url);
        const data = await res.json();
        setSuggestions(
          data.map((item) => ({
            name: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
          }))
        );
      } catch (err) {
        console.error('Autocomplete error:', err);
        setSuggestions([]);
      }
    }, 300); // 300ms debounce

    // cleanup on unmount or query change
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  return (
    <div className="space-y-2">
      <button
        onClick={askGeo}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Use My Location
      </button>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter U.S. city…"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded mt-1 max-h-40 overflow-auto">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  setQuery(s.name);
                  setSuggestions([]);
                  onSelect({ lat: s.lat, lon: s.lon, name: s.name });
                }}
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
