import React from 'react';
import { useStore } from '../store/useStore';
import { Clock, Play, Square, Trash2 } from 'lucide-react';
import { formatTime } from '../lib/utils';

export const TaskList: React.FC = () => {
  const { tasks, deleteTask, startTimer, stopTimer, activeTimer } = useStore();

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  task.priority === 'high'
                    ? 'bg-red-500'
                    : task.priority === 'medium'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              />
              <h3 className="font-medium">{task.title}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {formatTime(task.timeSpent || 0)}
                </span>
              </div>
              {activeTimer === task.id ? (
                <button
                  onClick={() => stopTimer()}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Square className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => startTimer(task.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Play className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {task.description}
          </p>
        </div>
      ))}
    </div>
  );
};