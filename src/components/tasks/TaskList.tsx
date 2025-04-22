import React, { useState, useMemo } from 'react';
import { Filter, ArrowUp, ArrowDown, UserCircle as LoaderCircle } from 'lucide-react';
import TaskItem from './TaskItem';
import Button from '../ui/Button';
import { Task } from '../../types';
import { useTaskContext } from '../../context/TaskContext';

interface TaskListProps {
  selectedListId: string;
}

type SortOption = 'dueDate' | 'priority' | 'createdAt';
type SortDirection = 'asc' | 'desc';
type FilterOption = 'all' | 'completed' | 'pending';

const TaskList: React.FC<TaskListProps> = ({ selectedListId }) => {
  const { tasks, lists } = useTaskContext();
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('desc');
    }
  };

  const selectedList = lists.find(list => list.id === selectedListId);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task => task.listId === selectedListId);
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return sortDirection === 'asc' ? 1 : -1;
        if (!b.dueDate) return sortDirection === 'asc' ? -1 : 1;
        return sortDirection === 'asc' 
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        return sortDirection === 'asc'
          ? priorityValues[a.priority] - priorityValues[b.priority]
          : priorityValues[b.priority] - priorityValues[a.priority];
      } else {
        return sortDirection === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    return sorted;
  }, [tasks, selectedListId, filterStatus, sortBy, sortDirection]);

  const completedTasksCount = tasks.filter(
    task => task.listId === selectedListId && task.status === 'completed'
  ).length;
  
  const totalTasksCount = tasks.filter(
    task => task.listId === selectedListId
  ).length;
  
  const completionPercentage = totalTasksCount > 0
    ? Math.round((completedTasksCount / totalTasksCount) * 100)
    : 0;

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center">
            {selectedList?.name || 'Tasks'}
            <span 
              className="ml-2 w-4 h-4 rounded-full"
              style={{ backgroundColor: selectedList?.color }}
            />
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {completedTasksCount} of {totalTasksCount} tasks completed
            {totalTasksCount > 0 && ` (${completionPercentage}%)`}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 relative">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center"
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          >
            <Filter className="w-4 h-4 mr-1" />
            <span>Filter & Sort</span>
          </Button>
          
          {isFilterMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="p-3">
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</h4>
                  <div className="flex flex-col space-y-1">
                    {(['all', 'pending', 'completed'] as FilterOption[]).map((option) => (
                      <button 
                        key={option}
                        className={`text-left px-2 py-1 text-sm rounded-md ${
                          filterStatus === option 
                            ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => {
                          setFilterStatus(option);
                        }}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sort By</h4>
                  <div className="flex flex-col space-y-1">
                    {[
                      { key: 'dueDate', label: 'Due Date' },
                      { key: 'priority', label: 'Priority' },
                      { key: 'createdAt', label: 'Created' },
                    ].map(({ key, label }) => (
                      <button 
                        key={key}
                        className={`text-left px-2 py-1 text-sm rounded-md flex items-center justify-between ${
                          sortBy === key
                            ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => toggleSort(key as SortOption)}
                      >
                        <span>{label}</span>
                        {sortBy === key && (
                          sortDirection === 'asc' 
                            ? <ArrowUp className="w-3 h-3" /> 
                            : <ArrowDown className="w-3 h-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {totalTasksCount > 0 && (
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-2 bg-indigo-500 dark:bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      )}
      
      {filteredAndSortedTasks.length > 0 ? (
        <div>
          {filteredAndSortedTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task}
              listColor={selectedList?.color || '#4F46E5'}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-3 mb-4">
            <LoaderCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
            {filterStatus === 'all' 
              ? 'No tasks in this list yet' 
              : filterStatus === 'completed'
                ? 'No completed tasks'
                : 'No pending tasks'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm">
            {filterStatus === 'all' 
              ? 'Click "Add Task" to create your first task in this list.' 
              : 'Adjust your filters to see more tasks.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;