import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './Navigation';
import AddTaskModal from './AddTaskModal';
import { useApp } from '../hooks/useAppContext';

export default function Layout({ children }) {
  const { modalOpen, editingTask, openAddTask, closeModal, addTask, updateTask } = useApp();

  const handleSave = (taskData) => {
    if (editingTask?.id) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    closeModal();
  };

  return (
    <div className="flex min-h-screen min-h-dvh bg-warm-50">
      <Navigation />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 pb-[calc(72px+env(safe-area-inset-bottom,0px))] md:pb-0 overflow-x-hidden">
        {children}
      </main>

      {/* Mobile FAB */}
      <button
        onClick={() => openAddTask()}
        className="md:hidden fixed bottom-[calc(76px+env(safe-area-inset-bottom,0px))] right-5 z-50
                   w-14 h-14 bg-warm-900 text-white rounded-full shadow-large
                   flex items-center justify-center transition-all duration-200
                   active:scale-90 hover:bg-warm-800"
        aria-label="Nueva tarea"
      >
        <Plus size={24} />
      </button>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <AddTaskModal
            initialData={editingTask}
            onSave={handleSave}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
