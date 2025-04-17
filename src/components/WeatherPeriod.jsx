// src/components/WeatherPeriod.jsx
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
// import your JSON animations e.g. clearDay from '../animations/clear-day.json'

function WeatherPeriod({ period }) {
  const ref = useRef(null);

  useEffect(() => {
    const animData = mapIconToLottie(period.icon); 
    const anim = lottie.loadAnimation({
      container: ref.current,
      animationData: animData,
      loop: true,
      autoplay: true
    });
    return () => anim.destroy();
  }, [period.icon]);

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded shadow">
      <div ref={ref} className="w-20 h-20" />
      <h3 className="mt-2 font-semibold">{period.name}</h3>
      <p>{period.temperature}°{period.temperatureUnit}</p>
      <p className="text-sm text-gray-600">{period.shortForecast}</p>
    </div>
  );
}
export default WeatherPeriod;
