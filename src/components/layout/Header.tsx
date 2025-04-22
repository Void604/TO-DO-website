import React, { useState, useEffect } from 'react';
import { Sun, Moon, Plus, Menu } from 'lucide-react';
import Button from '../ui/Button';
import { useTaskContext } from '../../context/TaskContext';
import TaskForm from '../tasks/TaskForm';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const { lists } = useTaskContext();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-3 md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
            <span className="hidden sm:inline">TaskFlow</span>
            <span className="sm:hidden">TF</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="primary" 
            size="sm"
            className="flex items-center"
            onClick={() => setIsTaskModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">New</span>
          </Button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {isTaskModalOpen && (
        <TaskForm
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          lists={lists}
        />
      )}
    </header>
  );
};

export default Header;