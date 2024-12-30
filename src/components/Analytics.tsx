import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '../store/useStore';

export const Analytics: React.FC = () => {
  const { tasks } = useStore();

  const categoryData = React.useMemo(() => {
    const data: Record<string, number> = {};
    tasks.forEach((task) => {
      data[task.category] = (data[task.category] || 0) + (task.timeSpent || 0);
    });
    return Object.entries(data).map(([name, value]) => ({
      name,
      minutes: Math.floor(value / 60),
    }));
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Time per Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Tasks
          </h4>
          <p className="text-2xl font-semibold mt-1">{tasks.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Completed Tasks
          </h4>
          <p className="text-2xl font-semibold mt-1">
            {tasks.filter((t) => t.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Time Tracked
          </h4>
          <p className="text-2xl font-semibold mt-1">
            {Math.floor(
              tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0) / 3600
            )}h
          </p>
        </div>
      </div>
    </div>
  );
};