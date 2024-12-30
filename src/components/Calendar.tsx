import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useStore } from '../store/useStore';

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const { tasks } = useStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="space-x-2">
          <button
            onClick={() =>
              setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
            }
            className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ←
          </button>
          <button
            onClick={() =>
              setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
            }
            className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            →
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayTasks = tasks.filter(
            (task) => task.dueDate === format(day, 'yyyy-MM-dd')
          );
          return (
            <div
              key={day.toString()}
              className="aspect-square p-1 border border-gray-200 dark:border-gray-700"
            >
              <div className="h-full w-full p-1">
                <span className="text-sm">{format(day, 'd')}</span>
                {dayTasks.length > 0 && (
                  <div className="mt-1">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className="text-xs truncate px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900 mb-1"
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};