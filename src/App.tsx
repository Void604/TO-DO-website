import React from 'react';
import Layout from './components/layout/Layout';
import TaskList from './components/tasks/TaskList';
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <TaskProvider>
      <Layout>
        <TaskList selectedListId="default" />
      </Layout>
    </TaskProvider>
  );
}

export default App;