import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskDialog } from '../components/tasks/TaskDialog';
import { Task } from '../types';

export const Dashboard = () => {
  const { tasks } = useStore();
  const [selectedTask, setSelectedTask] = React.useState<Task | undefined>();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const totalTime = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const urgentTasks = tasks.filter((t) => t.priority === 'high').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Time
              </p>
              <p className="text-xl font-semibold">
                {Math.floor(totalTime / 3600)}h {Math.floor((totalTime % 3600) / 60)}m
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Completed Tasks
              </p>
              <p className="text-xl font-semibold">{completedTasks}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Urgent Tasks
              </p>
              <p className="text-xl font-semibold">{urgentTasks}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
        <div className="space-y-3">
          {tasks.slice(0, 5).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(task) => {
                setSelectedTask(task);
                setIsDialogOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      <TaskDialog
        task={selectedTask}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedTask(undefined);
        }}
      />
    </div>
  );
};