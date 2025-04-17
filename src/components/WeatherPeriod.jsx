// src/components/WeatherPeriod.jsx
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { mapIconToLottie } from '../utils/iconMap';
import { convertTemp } from '../utils/temperature';

export default function WeatherPeriod({ period, unit = 'F', className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const animData = mapIconToLottie(period.icon, period.isDaytime);
    const anim = lottie.loadAnimation({
      container: ref.current,
      animationData: animData,
      loop: true,
      autoplay: true,
    });
    return () => anim.destroy();
  }, [period.icon, period.isDaytime]);

  const date = new Date(period.startTime);
  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const temp = convertTemp(period.temperature, unit);

  return (
    <div
      className={
        `flex flex-col justify-between items-center p-4 
         bg-gray-50 dark:bg-gray-700 
         border border-gray-200 dark:border-gray-600 
         rounded-lg shadow-sm 
         ${className}`
          .replace(/\s+/g,' ')
      }
    >
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {dateLabel}
      </div>
      <div ref={ref} className="w-20 h-20" />
      <h3 className="mt-2 font-semibold text-gray-800 dark:text-gray-200">
        {period.name}
      </h3>
      <p className="text-lg font-bold text-blue-600 dark:text-blue-300">
        {temp}°{unit}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
        {period.shortForecast}
      </p>
    </div>
  );
}
