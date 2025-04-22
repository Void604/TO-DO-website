import { Task, TaskList } from '../types';

const TASKS_KEY = 'todo-app-tasks';
const LISTS_KEY = 'todo-app-lists';

export const getTasks = (): Task[] => {
  const tasksJson = localStorage.getItem(TASKS_KEY);
  if (!tasksJson) return [];
  
  try {
    return JSON.parse(tasksJson).map((task: any) => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to parse tasks from localStorage', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const getLists = (): TaskList[] => {
  const listsJson = localStorage.getItem(LISTS_KEY);
  if (!listsJson) {
    // Create default lists if none exist
    const defaultLists: TaskList[] = [
      { id: 'default', name: 'General', color: '#4F46E5', createdAt: new Date() },
      { id: 'work', name: 'Work', color: '#10B981', createdAt: new Date() },
      { id: 'personal', name: 'Personal', color: '#F59E0B', createdAt: new Date() },
    ];
    saveLists(defaultLists);
    return defaultLists;
  }
  
  try {
    return JSON.parse(listsJson).map((list: any) => ({
      ...list,
      createdAt: new Date(list.createdAt),
    }));
  } catch (error) {
    console.error('Failed to parse lists from localStorage', error);
    return [];
  }
};

export const saveLists = (lists: TaskList[]): void => {
  localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
};