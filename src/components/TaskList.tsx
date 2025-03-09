import { Task } from '@/types/task';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  onToggleCompletion: (id: string, completed: boolean) => void;
  onSelectTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskList({ 
  tasks, 
  onToggleCompletion, 
  onSelectTask,
  onDeleteTask
}: TaskListProps) {
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 text-[var(--text-secondary)]">
        {tasks.some(task => task.completed) 
          ? "No completed tasks yet."
          : "No tasks yet. Add your first task above."}
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-[var(--danger)]';
      case 'medium':
        return 'bg-[var(--warning)]';
      case 'low':
        return 'bg-[var(--success)]';
      default:
        return 'bg-[var(--gray-400)]';
    }
  };

  return (
    <motion.ul 
      className="space-y-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.05 }}
    >
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.li 
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className={`task-item group px-3 py-3 rounded-lg ${
              hoveredTaskId === task.id ? 'bg-[var(--card-hover)]' : ''
            }`}
            onMouseEnter={() => setHoveredTaskId(task.id)}
            onMouseLeave={() => setHoveredTaskId(null)}
          >
            <div className="flex items-start">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleCompletion(task.id, !task.completed)}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 ${
                  task.completed 
                    ? 'bg-[var(--accent)] border-[var(--accent)]' 
                    : 'border-[var(--gray-400)] hover:border-[var(--accent)]'
                } flex items-center justify-center mr-3 mt-0.5 transition-colors`}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </motion.button>
              
              <div className="flex-1 min-w-0" onClick={() => onSelectTask(task)}>
                <div className="flex items-center">
                  <h3 className={`text-base font-normal ${
                    task.completed ? 'line-through text-[var(--gray-500)]' : 'text-[var(--text-primary)]'
                  } cursor-pointer`}>
                    {task.title}
                  </h3>
                  
                  {task.priority !== 'medium' && (
                    <span className={`ml-2 w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                  )}
                </div>
                
                {task.description && (
                  <p className="text-sm text-[var(--text-secondary)] mt-1 truncate cursor-pointer">
                    {task.description}
                  </p>
                )}
                
                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {task.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-0.5 text-xs rounded-full bg-[var(--gray-200)] text-[var(--gray-600)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: hoveredTaskId === task.id ? 1 : 0,
                  y: hoveredTaskId === task.id ? 0 : 5
                }}
                transition={{ duration: 0.2 }}
                className="flex space-x-1"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onSelectTask(task)}
                  className="text-[var(--gray-500)] hover:text-[var(--accent)] p-1 rounded-full hover:bg-[var(--gray-200)] transition-colors"
                  aria-label="Edit task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDeleteTask(task.id)}
                  className="text-[var(--gray-500)] hover:text-[var(--danger)] p-1 rounded-full hover:bg-[var(--gray-200)] transition-colors"
                  aria-label="Delete task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </motion.div>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
} 