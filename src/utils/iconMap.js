// src/utils/iconMap.js
// Updated to honor period.isDaytime flag
import clearDay from '../animations/clear-day.json';
import clearNight from '../animations/clear-night.json';
import rain from '../animations/rain.json';
import snow from '../animations/snow.json';
import cloudyDay from '../animations/cloudy.json';
import cloudyNight from '../animations/cloudy.json';
import partlyCloudyDay from '../animations/partly-cloudy-day.json';
import partlyCloudyNight from '../animations/partly-cloudy-night.json';

/**
 * Map a National Weather Service icon URL + daytime flag to a Lottie animation
 * @param {string} iconUrl - the URL string from period.icon
 * @param {boolean} isDaytime - the period.isDaytime flag
 * @returns {object} - Lottie JSON data
 */
export function mapIconToLottie(iconUrl, isDaytime) {
  const key = iconUrl.toLowerCase();

  if (!isDaytime) {
    // Night mappings
    if (key.includes('clear')) return clearNight;
    if (key.includes('few clouds') || key.includes('partly-cloudy') || key.includes('mostly clear')) return partlyCloudyNight;
    if (key.includes('rain') || key.includes('shower')) return rain;
    if (key.includes('snow') || key.includes('sleet')) return snow;
    if (key.includes('cloud')) return cloudyNight;
    return clearNight; // default night
  }

  // Day mappings
  if (key.includes('clear')) return clearDay;
  if (key.includes('few clouds') || key.includes('partly-cloudy') || key.includes('mostly sunny')) return partlyCloudyDay;
  if (key.includes('rain') || key.includes('shower')) return rain;
  if (key.includes('snow') || key.includes('sleet')) return snow;
  if (key.includes('cloud')) return cloudyDay;

  return clearDay; // default day
}
