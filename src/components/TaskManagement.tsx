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

  // Handle task reordering
  const handleReorderTasks = (reorderedTasks: Task[]) => {
    // Update the tasks state with the new order
    // This only updates the UI order, not the backend
    const updatedTasks = [...tasks];
    
    // Find the tasks that were reordered and update their positions in the main tasks array
    reorderedTasks.forEach((task, index) => {
      const taskIndex = updatedTasks.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        // Remove the task from its current position
        const [removedTask] = updatedTasks.splice(taskIndex, 1);
        // Find the position to insert it
        // We need to find where in the main array this task should go
        // based on its new position in the filtered list
        
        // Get all tasks of the same completion status
        const sameStatusTasks = updatedTasks.filter(t => 
          (activeFolder === 'active' && !t.completed) || 
          (activeFolder === 'completed' && t.completed)
        );
        
        // If there are no tasks of the same status, add it at the beginning
        if (sameStatusTasks.length === 0) {
          updatedTasks.unshift(removedTask);
        } else {
          // Find the position of the task that should come after this one
          if (index >= reorderedTasks.length - 1) {
            // This is the last task in the reordered list
            updatedTasks.push(removedTask);
          } else {
            // Find the position of the next task in the main array
            const nextTaskId = reorderedTasks[index + 1].id;
            const nextTaskIndex = updatedTasks.findIndex(t => t.id === nextTaskId);
            
            if (nextTaskIndex !== -1) {
              // Insert before the next task
              updatedTasks.splice(nextTaskIndex, 0, removedTask);
            } else {
              // If next task not found, add to the end
              updatedTasks.push(removedTask);
            }
          }
        }
      }
    });
    
    setTasks(updatedTasks);
    
    // In a real application, you would also want to save this order to the backend
    // taskService.updateTaskOrder(updatedTasks.map(task => task.id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--border)] overflow-hidden backdrop-blur-sm bg-opacity-90"
    >
      <div className="flex flex-col md:flex-row">
        <FolderNavigation 
          activeFolder={activeFolder} 
          onFolderChange={setActiveFolder}
          activeTasks={tasks.filter(task => !task.completed).length}
          completedTasks={tasks.filter(task => task.completed).length}
        />
        
        <div className="flex-1 p-6 md:p-8">
          <motion.h2 
            key={activeFolder}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-medium mb-6 text-[var(--text-primary)] flex items-center"
          >
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] w-1.5 h-5 rounded-full mr-2.5"></span>
            {activeFolder === 'active' ? 'Active Tasks' : 'Completed Tasks'}
          </motion.h2>
          
          {/* New Task Input - Only show in active tasks */}
          {activeFolder === 'active' && (
            <form onSubmit={handleCreateTask} className="mb-8">
              <div className="flex items-center border-b-2 border-[var(--gray-300)] pb-3 group focus-within:border-[var(--accent)] transition-colors relative">
                <span className="mr-3 text-[var(--gray-500)] group-focus-within:text-[var(--accent)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-[var(--text-primary)] placeholder-[var(--gray-500)] text-base"
                />
                {newTaskTitle.trim() && (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="ml-2 p-1.5 rounded-full bg-[var(--accent)] text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.button>
                )}
              </div>
            </form>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
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
                className="relative"
              >
                {filteredTasks.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="w-16 h-16 bg-[var(--gray-200)] rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--gray-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {activeFolder === 'active' 
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        }
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                      {activeFolder === 'active' 
                        ? "No active tasks" 
                        : "No completed tasks"}
                    </h3>
                    <p className="text-[var(--text-secondary)] max-w-xs">
                      {activeFolder === 'active' 
                        ? "Add a new task using the input above" 
                        : "Complete some tasks to see them here"}
                    </p>
                  </motion.div>
                )}
                
                <TaskList
                  tasks={filteredTasks}
                  onToggleCompletion={handleToggleCompletion}
                  onSelectTask={setSelectedTask}
                  onDeleteTask={handleDeleteTask}
                  onReorder={handleReorderTasks}
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