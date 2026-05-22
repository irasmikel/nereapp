import { useState, useEffect, useCallback, useMemo } from 'react';
import { storage } from '../services/storage';
import {
  isTaskDueOnDate,
  isTaskCompletedOnDate,
  isTaskOverdue,
  generateTaskId,
  getCompletionStats,
  calculateStreak,
} from '../utils/taskUtils';
import { getTodayString, getDateString, addDays } from '../utils/dateUtils';
import { getSampleTasks } from '../data/sampleData';

const STORAGE_KEY = 'tasks';

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = storage.get(STORAGE_KEY);
    if (saved && saved.length > 0) return saved;
    // First run: load sample data
    const samples = getSampleTasks();
    storage.set(STORAGE_KEY, samples);
    return samples;
  });

  // Persist on every change
  useEffect(() => {
    storage.set(STORAGE_KEY, tasks);
  }, [tasks]);

  // --- CRUD ---

  const addTask = useCallback((taskData) => {
    const task = {
      ...taskData,
      id: generateTaskId(),
      completedDates: taskData.completedDates || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [task, ...prev]);
    return task;
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, ...updates, updatedAt: new Date().toISOString() }
        : t
    ));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // --- COMPLETION ---

  const toggleComplete = useCallback((id, dateStr = null) => {
    const date = dateStr || getTodayString();
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const completedDates = t.completedDates || [];
      const isCompleted = completedDates.includes(date);
      return {
        ...t,
        completedDates: isCompleted
          ? completedDates.filter(d => d !== date)
          : [...completedDates, date],
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const completeTask = useCallback((id, dateStr = null) => {
    const date = dateStr || getTodayString();
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const completedDates = t.completedDates || [];
      if (completedDates.includes(date)) return t;
      return { ...t, completedDates: [...completedDates, date], updatedAt: new Date().toISOString() };
    }));
  }, []);

  const uncompleteTask = useCallback((id, dateStr = null) => {
    const date = dateStr || getTodayString();
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        completedDates: (t.completedDates || []).filter(d => d !== date),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  // --- QUERIES ---

  const getTasksForDate = useCallback((dateStr) => {
    return tasks.filter(t => isTaskDueOnDate(t, dateStr));
  }, [tasks]);

  const getTodayTasks = useCallback(() => {
    return getTasksForDate(getTodayString());
  }, [getTasksForDate]);

  const getOverdueTasks = useCallback(() => {
    return tasks.filter(t => isTaskOverdue(t));
  }, [tasks]);

  const getUpcomingTasks = useCallback((days = 7) => {
    const upcoming = [];
    for (let i = 1; i <= days; i++) {
      const dateStr = getDateString(addDays(new Date(), i));
      const due = getTasksForDate(dateStr).map(t => ({ ...t, _dueDate: dateStr }));
      upcoming.push(...due);
    }
    return upcoming;
  }, [getTasksForDate]);

  // --- STATISTICS ---

  const stats = useMemo(() => {
    const today = getTodayString();
    const todayTasks = getTasksForDate(today);
    const todayCompleted = todayTasks.filter(t => isTaskCompletedOnDate(t, today));
    const overdue = getOverdueTasks();

    const weekStats = getCompletionStats(tasks, 7);
    const monthStats = getCompletionStats(tasks, 30);

    const streak = calculateStreak(tasks, 30);

    const totalCompleted = tasks.reduce((sum, t) => sum + (t.completedDates || []).length, 0);

    const weekCompleted = weekStats.reduce((s, d) => s + d.completed, 0);
    const weekDue = weekStats.reduce((s, d) => s + d.due, 0);
    const weekRate = weekDue > 0 ? Math.round((weekCompleted / weekDue) * 100) : 0;

    const categoryStats = {};
    tasks.forEach(task => {
      if (!categoryStats[task.category]) categoryStats[task.category] = { completed: 0, total: 0 };
      const dueInMonth = getCompletionStats([task], 30);
      dueInMonth.forEach(d => {
        if (d.due > 0) {
          categoryStats[task.category].total += d.due;
          categoryStats[task.category].completed += d.completed;
        }
      });
    });

    return {
      todayTotal: todayTasks.length,
      todayCompleted: todayCompleted.length,
      todayProgress: todayTasks.length > 0 ? Math.round((todayCompleted.length / todayTasks.length) * 100) : 0,
      overdueCount: overdue.length,
      streak,
      totalCompleted,
      weekRate,
      weekStats,
      monthStats,
      categoryStats,
    };
  }, [tasks, getTasksForDate, getOverdueTasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    completeTask,
    uncompleteTask,
    getTodayTasks,
    getTasksForDate,
    getOverdueTasks,
    getUpcomingTasks,
    isTaskDueOnDate,
    isTaskCompletedOnDate,
    stats,
  };
}
