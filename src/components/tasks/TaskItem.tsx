import React, { useState } from 'react';
import { Check, Clock, Edit, Trash2, Flag } from 'lucide-react';
import Badge from '../ui/Badge';
import { Task, Priority, TaskList } from '../../types';
import { useTaskContext } from '../../context/TaskContext';
import TaskForm from './TaskForm';

interface TaskItemProps {
  task: Task;
  listColor: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, listColor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateTaskStatus, deleteTask, updateTaskPriority, lists } = useTaskContext();

  const priorityColors: Record<Priority, string> = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-red-100 text-red-800',
  };

  const priorityIcons: Record<Priority, JSX.Element> = {
    low: <Flag className="w-3 h-3 text-blue-600" />,
    medium: <Flag className="w-3 h-3 text-amber-600" />,
    high: <Flag className="w-3 h-3 text-red-600" />,
  };

  const handleToggleStatus = () => {
    updateTaskStatus(
      task.id, 
      task.status === 'completed' ? 'pending' : 'completed'
    );
  };

  const handlePriorityChange = () => {
    const priorities: Priority[] = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(task.priority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    updateTaskPriority(task.id, priorities[nextIndex]);
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return null;
    
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date() && task.status === 'pending';
  };

  return (
    <>
      <div className={`group bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 p-3 mb-3 transform transition-all duration-200 hover:shadow 
        ${task.status === 'completed' ? 'border-green-400 dark:border-green-600 opacity-75' : `border-l-4`}
        ${isOverdue() ? 'border-red-500' : ''}
      `}
      style={{ borderLeftColor: task.status === 'completed' ? undefined : listColor }}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={handleToggleStatus}
            className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border transition-colors ${
              task.status === 'completed'
                ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            aria-label={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.status === 'completed' && (
              <Check className="w-full h-full text-white p-0.5" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3
                className={`font-medium text-gray-900 dark:text-gray-100 truncate ${
                  task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : ''
                }`}
              >
                {task.title}
              </h3>
              
              <div className="flex items-center ml-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handlePriorityChange}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Change priority"
                >
                  {priorityIcons[task.priority]}
                </button>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Edit task"
                >
                  <Edit className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                </button>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            {task.description && (
              <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 ${
                task.status === 'completed' ? 'line-through' : ''
              }`}>
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center mt-2 gap-2">
              {task.dueDate && (
                <Badge 
                  variant={isOverdue() ? "danger" : "default"}
                  className="flex items-center"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(task.dueDate)}
                </Badge>
              )}
              
              <Badge variant={
                task.priority === 'high' ? 'danger' :
                task.priority === 'medium' ? 'warning' : 'info'
              }>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {isEditing && (
        <TaskForm
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          task={task}
          lists={lists}
        />
      )}
    </>
  );
};

export default TaskItem;