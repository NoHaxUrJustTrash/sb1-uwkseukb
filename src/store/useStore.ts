import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '../types';
import { supabase } from '../lib/supabase';

interface ProductivityStore {
  tasks: Task[];
  activeTimer: string | null;
  timerStartTime: number | null;
  elapsedTime: number;
  darkMode: boolean;
  user: any | null;
  addTask: (task: Task) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  startTimer: (taskId: string) => void;
  stopTimer: () => Promise<void>;
  updateElapsedTime: () => void;
  toggleDarkMode: () => void;
  setUser: (user: any) => void;
  clearTasks: () => void;
}

export const useStore = create<ProductivityStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      activeTimer: null,
      timerStartTime: null,
      elapsedTime: 0,
      darkMode: false,
      user: null,
      addTask: async (task) => {
        const { data, error } = await supabase
          .from('tasks')
          .insert([{
            user_id: get().user?.id,
            title: task.title,
            description: task.description,
            category: task.category,
            priority: task.priority,
            status: task.status,
            due_date: task.dueDate,
            time_spent: task.timeSpent
          }])
          .select()
          .single();

        if (!error && data) {
          const newTask: Task = {
            id: data.id,
            title: data.title,
            description: data.description || '',
            category: data.category,
            priority: data.priority as Task['priority'],
            status: data.status as Task['status'],
            dueDate: data.due_date || '',
            timeSpent: data.time_spent,
            subtasks: []
          };
          set((state) => ({ tasks: [...state.tasks, newTask] }));
        }
      },
      updateTask: async (taskId, updates) => {
        const mappedUpdates: any = {};
        if (updates.title) mappedUpdates.title = updates.title;
        if (updates.description) mappedUpdates.description = updates.description;
        if (updates.category) mappedUpdates.category = updates.category;
        if (updates.priority) mappedUpdates.priority = updates.priority;
        if (updates.status) mappedUpdates.status = updates.status;
        if (updates.dueDate) mappedUpdates.due_date = updates.dueDate;
        if (updates.timeSpent) mappedUpdates.time_spent = updates.timeSpent;

        const { error } = await supabase
          .from('tasks')
          .update(mappedUpdates)
          .eq('id', taskId)
          .eq('user_id', get().user?.id);

        if (!error) {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
          }));
        }
      },
      deleteTask: async (taskId) => {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', taskId)
          .eq('user_id', get().user?.id);

        if (!error) {
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
            ...(state.activeTimer === taskId
              ? { activeTimer: null, timerStartTime: null, elapsedTime: 0 }
              : {}),
          }));
        }
      },
      startTimer: (taskId) =>
        set({ activeTimer: taskId, timerStartTime: Date.now(), elapsedTime: 0 }),
      stopTimer: async () => {
        const state = get();
        if (!state.activeTimer || !state.timerStartTime) return;
        
        const timeSpent = Math.floor(
          (Date.now() - state.timerStartTime) / 1000
        );
        
        await supabase
          .from('tasks')
          .update({ time_spent: timeSpent })
          .eq('id', state.activeTimer)
          .eq('user_id', state.user?.id);

        // Update weekly productivity
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        
        const { data: existingEntry } = await supabase
          .from('weekly_productivity')
          .select()
          .eq('user_id', state.user?.id)
          .eq('week_start', weekStart.toISOString().split('T')[0])
          .single();

        if (existingEntry) {
          await supabase
            .from('weekly_productivity')
            .update({ 
              total_time: existingEntry.total_time + timeSpent,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingEntry.id);
        } else {
          await supabase
            .from('weekly_productivity')
            .insert({
              user_id: state.user?.id,
              username: state.user?.user_metadata?.username,
              total_time: timeSpent,
              week_start: weekStart.toISOString().split('T')[0]
            });
        }
        
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === state.activeTimer
              ? { ...task, timeSpent: (task.timeSpent || 0) + timeSpent }
              : task
          ),
          activeTimer: null,
          timerStartTime: null,
          elapsedTime: 0,
        }));
      },
      updateElapsedTime: () => {
        const state = get();
        if (state.activeTimer && state.timerStartTime) {
          set({
            elapsedTime: Math.floor((Date.now() - state.timerStartTime) / 1000),
          });
        }
      },
      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),
      setUser: (user) => set({ user }),
      clearTasks: () => set({ tasks: [] }),
    }),
    {
      name: 'productivity-store',
    }
  )
);