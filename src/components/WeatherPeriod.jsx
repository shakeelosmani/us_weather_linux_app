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

   // convert temp
   const temp = convertTemp(period.temperature, unit);

   return (
     <div className={`flex flex-col justify-between items-center p-4 bg-white dark:bg-gray-700 rounded shadow ${className}`}>
       <div ref={ref} className="w-20 h-20" />
       <div className="text-center">
         <h3 className="mt-2 font-semibold">{period.name}</h3>
            <p>{temp}°{unit}</p>
         <p className="text-sm text-gray-600 dark:text-gray-300">
           {period.shortForecast}
         </p>
       </div>
     </div>
   );
 }
