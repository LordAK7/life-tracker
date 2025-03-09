'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';
import { taskService } from '@/services/taskService';
import TaskList from './TaskList';
import TaskDetails from './TaskDetails';
import FolderNavigation from './FolderNavigation';

type Folder = 'active' | 'completed';

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeFolder, setActiveFolder] = useState<Folder>('active');

  // Fetch tasks
  const fetchTasks = async () => {
    setIsLoading(true);
    const fetchedTasks = await taskService.getTasks();
    setTasks(fetchedTasks);
    setIsLoading(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks based on active folder
  const filteredTasks = tasks.filter(task => 
    activeFolder === 'active' ? !task.completed : task.completed
  );

  // Handle task creation
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) return;
    
    const newTask = await taskService.createTask({
      title: newTaskTitle,
      description: '',
      priority: 'medium',
      completed: false,
      tags: []
    });
    
    if (newTask) {
      setTasks(prev => [newTask, ...prev]);
      setNewTaskTitle('');
    }
  };

  // Handle task update
  const handleUpdateTask = async (task: Task) => {
    const updatedTask = await taskService.updateTask(task.id, task);
    if (updatedTask) {
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      setSelectedTask(null);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (id: string) => {
    const success = await taskService.deleteTask(id);
    if (success) {
      setTasks(prev => prev.filter(task => task.id !== id));
      if (selectedTask?.id === id) {
        setSelectedTask(null);
      }
    }
  };

  // Handle task completion toggle
  const handleToggleCompletion = async (id: string, completed: boolean) => {
    const success = await taskService.toggleTaskCompletion(id, completed);
    if (success) {
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, completed } : task
        )
      );
      
      if (selectedTask?.id === id) {
        setSelectedTask(prev => prev ? { ...prev, completed } : null);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--border)] overflow-hidden"
    >
      <div className="flex">
        <FolderNavigation 
          activeFolder={activeFolder} 
          onFolderChange={setActiveFolder}
          activeTasks={tasks.filter(task => !task.completed).length}
          completedTasks={tasks.filter(task => task.completed).length}
        />
        
        <div className="flex-1 p-6">
          <motion.h2 
            key={activeFolder}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-medium mb-6"
          >
            {activeFolder === 'active' ? 'Active Tasks' : 'Completed Tasks'}
          </motion.h2>
          
          {/* New Task Input - Only show in active tasks */}
          {activeFolder === 'active' && (
            <form onSubmit={handleCreateTask} className="mb-6">
              <div className="flex items-center border-b border-[var(--gray-300)] pb-2 group focus-within:border-[var(--accent)]">
                <span className="mr-3 text-[var(--gray-500)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-[var(--text-primary)] placeholder-[var(--gray-500)]"
                />
              </div>
            </form>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-8 w-8 border-t-2 border-b-2 border-[var(--accent)] rounded-full"
              />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFolder}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TaskList
                  tasks={filteredTasks}
                  onToggleCompletion={handleToggleCompletion}
                  onSelectTask={setSelectedTask}
                  onDeleteTask={handleDeleteTask}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {selectedTask && (
          <TaskDetails
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
} 