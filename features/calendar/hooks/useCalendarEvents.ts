import { useGetMyTasks } from '@/features/tasks/api/useGetMyTasks';
import { format, isSameDay, isValid } from 'date-fns';

export const useCalendarEvents = () => {
  const { data: tasks } = useGetMyTasks();

  const getEventsForDay = (day: Date) => {
    if (!tasks?.data) return [];
    return tasks.data
      .filter((task) => {
        if (!task.deadlines) return false;
        const taskDate = new Date(task.deadlines);
        return isValid(taskDate) && isSameDay(taskDate, day);
      })
      .map((task) => ({
        id: task.id,
        title: task.title,
        time: format(new Date(task.deadlines), 'h:mm a'),
        color: 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
      }));
  };

  return { getEventsForDay };
};
