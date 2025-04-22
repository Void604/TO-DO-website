import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState('default');

  useEffect(() => {
    const savedListId = localStorage.getItem('selectedListId');
    if (savedListId) {
      setSelectedListId(savedListId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedListId', selectedListId);
  }, [selectedListId]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelectList = (listId: string) => {
    setSelectedListId(listId);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen} 
          selectedListId={selectedListId}
          onSelectList={handleSelectList}
        />
        
        <main className="flex-1 md:ml-64 pt-4 px-4 pb-8 transition-all duration-300">
          <div className="container mx-auto">
            {React.cloneElement(children as React.ReactElement, { selectedListId })}
          </div>
        </main>
      </div>
      
      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;