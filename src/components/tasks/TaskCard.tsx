import React from 'react';
import { Clock, Play, Pause, Pencil, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatTime } from '../../lib/utils';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { deleteTask, startTimer, stopTimer, activeTimer, elapsedTime } = useStore();
  const isActive = activeTimer === task.id;
  const totalTime = isActive ? task.timeSpent + elapsedTime : task.timeSpent;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${
                task.priority === 'high'
                  ? 'bg-red-500'
                  : task.priority === 'medium'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            />
            <h3 className="font-medium">{task.title}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {task.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
              {task.category}
            </span>
            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="w-4 h-4" />
            <span>{formatTime(totalTime)}</span>
          </div>
          <button
            onClick={() => (isActive ? stopTimer() : startTimer(task.id))}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isActive ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};