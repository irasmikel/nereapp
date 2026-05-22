import { getTodayString, getDateString, addDays } from '../utils/dateUtils';

export function getSampleTasks() {
  const today = new Date();
  const todayStr = getTodayString();
  const yesterday = getDateString(addDays(today, -1));
  const twoDaysAgo = getDateString(addDays(today, -2));

  return [
    { id: 'sample-1', title: 'Barrer la cocina', description: '', category: 'kitchen', startDate: todayStr, recurrence: { type: 'daily', interval: 1 }, notes: '', estimatedDuration: 10, completedDates: [yesterday, twoDaysAgo], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'sample-2', title: 'Limpiar el baño', description: 'Incluye ducha, lavabo e inodoro', category: 'bathroom', startDate: todayStr, recurrence: { type: 'weekly', daysOfWeek: [1, 4] }, notes: '', estimatedDuration: 30, completedDates: [twoDaysAgo], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'sample-3', title: 'Pasar la aspiradora', description: '', category: 'living', startDate: todayStr, recurrence: { type: 'weekly', daysOfWeek: [3, 6] }, notes: '', estimatedDuration: 20, completedDates: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'sample-4', title: 'Poner la lavadora', description: '', category: 'laundry', startDate: todayStr, recurrence: { type: 'weekly', daysOfWeek: [1, 4] }, notes: '', estimatedDuration: 5, completedDates: [yesterday], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'sample-5', title: 'Cambiar sábanas', description: '', category: 'bedroom', startDate: getDateString(addDays(today, -7)), recurrence: { type: 'weekly', daysOfWeek: [0] }, notes: '', estimatedDuration: 15, completedDates: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'sample-6', title: 'Hacer la compra', description: 'Mirar la nevera antes', category: 'shopping', startDate: getDateString(addDays(today, 1)), recurrence: { type: 'weekly', daysOfWeek: [6] }, notes: '', estimatedDuration: 60, completedDates: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'sample-7', title: 'Revisar filtro del aire', description: '', category: 'maintenance', startDate: getDateString(addDays(today, -90)), recurrence: { type: 'monthly', daysOfMonth: [1] }, notes: '', estimatedDuration: 20, completedDates: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'sample-8', title: 'Fregar el suelo', description: '', category: 'kitchen', startDate: todayStr, recurrence: { type: 'weekly', daysOfWeek: [3, 6] }, notes: '', estimatedDuration: 15, completedDates: [twoDaysAgo], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
}
