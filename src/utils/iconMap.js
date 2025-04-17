// src/utils/iconMap.js
// Import Lottie JSON animation files (place your downloaded .json in src/animations)
import clearDay from '../animations/clear-day.json';
import clearNight from '../animations/clear-night.json';
import rain from '../animations/rain.json';
import snow from '../animations/snow.json';
import cloudy from '../animations/cloudy.json';
import partlyCloudyDay from '../animations/partly-cloudy-day.json';
import partlyCloudyNight from '../animations/partly-cloudy-night.json';

/**
 * Map a National Weather Service icon URL to a Lottie animation
 * @param {string} iconUrl - the URL string from period.icon
 * @returns {object} - Lottie JSON data
 */
export function mapIconToLottie(iconUrl) {
  const key = iconUrl.toLowerCase();

  if (key.includes('night')) {
    if (key.includes('clear')) return clearNight;
    if (key.includes('few clouds') || key.includes('partly-cloudy')) return partlyCloudyNight;
  } else {
    if (key.includes('clear')) return clearDay;
    if (key.includes('few clouds') || key.includes('partly-cloudy')) return partlyCloudyDay;
  }
  if (key.includes('rain') || key.includes('shower')) return rain;
  if (key.includes('snow') || key.includes('sleet')) return snow;
  if (key.includes('cloud')) return cloudy;

  // Fallback
  return clearDay;
}
