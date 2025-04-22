export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date | null;
  status: TaskStatus;
  priority: Priority;
  listId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}