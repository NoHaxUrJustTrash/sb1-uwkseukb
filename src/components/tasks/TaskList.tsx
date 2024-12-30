import React from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { TaskCard } from './TaskCard';
import { TaskDialog } from './TaskDialog';
import { Task } from '../../types';

export const TaskList = () => {
  const { tasks } = useStore();
  const [selectedTask, setSelectedTask] = React.useState<Task | undefined>();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
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