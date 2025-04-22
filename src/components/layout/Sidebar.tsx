import React from 'react';
import { ListChecks, Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import { useTaskContext } from '../../context/TaskContext';

interface SidebarProps {
  isOpen: boolean;
  selectedListId: string;
  onSelectList: (listId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  selectedListId,
  onSelectList,
}) => {
  const { lists, tasks, addList, deleteList } = useTaskContext();

  const handleAddList = () => {
    const name = prompt('Enter list name:');
    if (name) {
      // Generate a random color
      const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      addList(name, randomColor);
    }
  };

  const handleDeleteList = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (id === 'default') {
      alert('Cannot delete the default list');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this list?')) {
      deleteList(id);
      if (selectedListId === id) {
        onSelectList('default');
      }
    }
  };

  const getTaskCountForList = (listId: string) => {
    return tasks.filter(task => task.listId === listId).length;
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-50 dark:bg-gray-900 transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 border-r border-gray-200 dark:border-gray-700 pt-16`}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">My Lists</h2>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={handleAddList}
            aria-label="Add new list"
          >
            <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Button>
        </div>
        
        <ul className="space-y-1 flex-1 overflow-y-auto">
          {lists.map((list) => (
            <li key={list.id}>
              <button
                onClick={() => onSelectList(list.id)}
                className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${
                  selectedListId === list.id
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-3" 
                    style={{ backgroundColor: list.color }} 
                  />
                  <span className="truncate">{list.name}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 mr-1">
                    {getTaskCountForList(list.id)}
                  </span>
                  
                  {list.id !== 'default' && (
                    <button
                      onClick={(e) => handleDeleteList(list.id, e)}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      aria-label={`Delete ${list.name} list`}
                    >
                      <Trash2 className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <ListChecks className="w-4 h-4 mr-2" />
            <span>Total: {tasks.length} tasks</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;