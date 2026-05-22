import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AppContext } from './hooks/useAppContext';
import { useTasks } from './hooks/useTasks';
import { useSettings } from './hooks/useSettings';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Today from './pages/Today';
import AllTasks from './pages/AllTasks';
import Calendar from './pages/Calendar';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';

export default function App() {
  const taskStore = useTasks();
  const settingsStore = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const openAddTask = (defaults = {}) => {
    setEditingTask(defaults);
    setModalOpen(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const contextValue = {
    ...taskStore,
    ...settingsStore,
    modalOpen,
    editingTask,
    openAddTask,
    openEditTask,
    closeModal,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {/* HashRouter usa URLs tipo /#/today en lugar de /today */}
      {/* Esto funciona en GitHub Pages sin necesitar configuración de servidor */}
      <HashRouter>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/today" element={<Today />} />
              <Route path="/tasks" element={<AllTasks />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/stats" element={<Statistics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </HashRouter>
    </AppContext.Provider>
  );
}
