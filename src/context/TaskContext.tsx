import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskList, Priority, TaskStatus } from '../types';
import { getTasks, saveTasks, getLists, saveLists } from '../utils/storage';

interface TaskContextProps {
  tasks: Task[];
  lists: TaskList[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (id: string) => void;
  addList: (name: string, color: string) => void;
  updateList: (id: string, updates: Partial<Omit<TaskList, 'id' | 'createdAt'>>) => void;
  deleteList: (id: string) => void;
  getTasksForList: (listId: string) => Task[];
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateTaskPriority: (id: string, priority: Priority) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);

  useEffect(() => {
    setTasks(getTasks());
    setLists(getLists());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveLists(lists);
  }, [lists]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const updateTask = (
    id: string, 
    updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date() } 
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const addList = (name: string, color: string) => {
    const newList: TaskList = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: new Date(),
    };
    setLists(prevLists => [...prevLists, newList]);
  };

  const updateList = (
    id: string, 
    updates: Partial<Omit<TaskList, 'id' | 'createdAt'>>
  ) => {
    setLists(prevLists => 
      prevLists.map(list => 
        list.id === id 
          ? { ...list, ...updates } 
          : list
      )
    );
  };

  const deleteList = (id: string) => {
    // Move tasks from deleted list to default list
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.listId === id 
          ? { ...task, listId: 'default', updatedAt: new Date() } 
          : task
      )
    );
    
    // Delete the list
    setLists(prevLists => prevLists.filter(list => list.id !== id));
  };

  const getTasksForList = (listId: string) => {
    return tasks.filter(task => task.listId === listId);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
  };

  const updateTaskPriority = (id: string, priority: Priority) => {
    updateTask(id, { priority });
  };

  const value = {
    tasks,
    lists,
    addTask,
    updateTask,
    deleteTask,
    addList,
    updateList,
    deleteList,
    getTasksForList,
    updateTaskStatus,
    updateTaskPriority,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};