import React from 'react';

export default function AlertsBanner({ alerts }) {
  if (!alerts.length) return null;

  return (
    <section className="mx-auto max-w-full p-4 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700">
      <h2 className="text-lg font-bold text-red-700 dark:text-red-300 mb-4 flex items-center">
        <span className="mr-2">🚨</span> Weather Alerts
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {alerts.map((alert) => {
          const { id, properties } = alert;
          return (
            <div
              key={id}
              className="p-4 bg-red-100 dark:bg-red-800 border border-red-200 dark:border-red-700 rounded-lg shadow-sm flex flex-col justify-between"
            >
              <h3 className="font-semibold text-red-800 dark:text-red-200">
                {properties.headline}
              </h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300 flex-grow">
                {properties.description}
              </p>
              {properties.instruction && (
                <p className="mt-2 text-sm italic text-red-700 dark:text-red-300">
                  {properties.instruction}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
