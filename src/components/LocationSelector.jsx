import React, { useState } from 'react';

export default function LocationSelector({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Browser geolocation
  const askGeo = () =>
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => onSelect({ lat: coords.latitude, lon: coords.longitude }),
      () => console.warn('Geolocation denied'),
      { enableHighAccuracy: true }
    );

  // Nominatim autocomplete
  const onChange = async (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.length > 2) {
      try {
        const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
          q
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
    } else {
      setSuggestions([]);
    }
  };

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
          onChange={onChange}
          placeholder="Enter U.S. city…"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded mt-1 max-h-40 overflow-auto">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  onSelect({ lat: s.lat, lon: s.lon });
                  setQuery(s.name);
                  setSuggestions([]);
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
