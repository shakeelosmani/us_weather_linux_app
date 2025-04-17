import React from 'react';
import { Bell } from 'lucide-react';

export default function AlertsBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-400 rounded-lg p-4 mb-6 flex items-start space-x-3">
      <Bell className="w-6 h-6 flex-shrink-0 text-red-500 dark:text-red-300" />
      <div>
        <p className="font-bold text-red-800 dark:text-red-200 mb-2">Weather Alerts</p>
        <ul className="list-disc list-inside text-red-700 dark:text-red-100 space-y-1">
          {alerts.map((alert) => (
            <li key={alert.id}>
              {alert.properties.headline}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
