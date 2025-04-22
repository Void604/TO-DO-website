import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Priority, Task, TaskList } from '../../types';
import { useTaskContext } from '../../context/TaskContext';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  lists: TaskList[];
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  task,
  lists,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [listId, setListId] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});

  const { addTask, updateTask } = useTaskContext();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setPriority(task.priority);
      setListId(task.listId);
    } else {
      // Set default values for new task
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setListId(lists.length > 0 ? lists[0].id : 'default');
    }
  }, [task, lists]);

  const validateForm = () => {
    const newErrors: { title?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (task) {
      // Update existing task
      updateTask(task.id, {
        title,
        description: description || undefined,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        listId,
      });
    } else {
      // Create new task
      addTask({
        title,
        description: description || undefined,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        status: 'pending',
        listId,
      });
    }
    
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Add New Task'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {task ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          fullWidth
          error={errors.title}
          autoFocus
        />
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this task (optional)"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="list" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              List
            </label>
            <select
              id="list"
              value={listId}
              onChange={(e) => setListId(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <div className="flex space-x-2">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <Button
                key={p}
                type="button"
                variant={priority === p ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setPriority(p)}
                className={`flex-1 capitalize ${
                  priority === p 
                    ? p === 'low' 
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : p === 'medium'
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-red-600 hover:bg-red-700'
                    : ''
                }`}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;