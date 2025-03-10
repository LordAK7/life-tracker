import { motion } from 'framer-motion';

type Folder = 'active' | 'completed';

interface FolderNavigationProps {
  activeFolder: Folder;
  onFolderChange: (folder: Folder) => void;
  activeTasks: number;
  completedTasks: number;
}

export default function FolderNavigation({ 
  activeFolder, 
  onFolderChange,
  activeTasks,
  completedTasks
}: FolderNavigationProps) {
  return (
    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--border)] p-5 bg-[var(--gray-100)] bg-opacity-50">
      <h3 className="text-sm font-medium text-[var(--gray-600)] uppercase tracking-wider mb-5 px-2 flex items-center">
        <span className="w-1 h-4 bg-gradient-to-b from-[var(--accent)] to-[var(--accent-hover)] rounded-full mr-2"></span>
        Folders
      </h3>
      
      <div className="space-y-3">
        <button
          onClick={() => onFolderChange('active')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
            activeFolder === 'active' 
              ? 'bg-[var(--accent-light)] border-l-2 border-[var(--accent)] shadow-sm' 
              : 'hover:bg-[var(--folder-hover)]'
          }`}
        >
          <div className="flex items-center">
            <div className={`p-1.5 rounded-md ${activeFolder === 'active' ? 'bg-[var(--accent)] bg-opacity-20' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className={`ml-3 text-[var(--text-primary)] font-medium ${activeFolder === 'active' ? 'text-[var(--accent)]' : ''}`}>Active</span>
          </div>
          
          <motion.div 
            key={activeTasks}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${
              activeFolder === 'active' 
                ? 'bg-[var(--accent)] text-white' 
                : 'bg-[var(--gray-300)] text-[var(--text-secondary)]'
            } text-xs px-2 py-0.5 rounded-full font-medium min-w-[1.5rem] text-center`}
          >
            {activeTasks}
          </motion.div>
        </button>
        
        <button
          onClick={() => onFolderChange('completed')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
            activeFolder === 'completed' 
              ? 'bg-[var(--accent-light)] border-l-2 border-[var(--accent)] shadow-sm' 
              : 'hover:bg-[var(--folder-hover)]'
          }`}
        >
          <div className="flex items-center">
            <div className={`p-1.5 rounded-md ${activeFolder === 'completed' ? 'bg-[var(--success)] bg-opacity-20' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className={`ml-3 text-[var(--text-primary)] font-medium ${activeFolder === 'completed' ? 'text-[var(--accent)]' : ''}`}>Completed</span>
          </div>
          
          <motion.div 
            key={completedTasks}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${
              activeFolder === 'completed' 
                ? 'bg-[var(--accent)] text-white' 
                : 'bg-[var(--gray-300)] text-[var(--text-secondary)]'
            } text-xs px-2 py-0.5 rounded-full font-medium min-w-[1.5rem] text-center`}
          >
            {completedTasks}
          </motion.div>
        </button>
      </div>
      
      <div className="mt-8 px-2">
        <div className="bg-[var(--gray-200)] rounded-lg p-3 border border-[var(--gray-300)]">
          <h4 className="text-xs font-medium text-[var(--gray-600)] uppercase tracking-wider mb-2">Task Summary</h4>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[var(--text-secondary)]">Active</span>
            <span className="text-xs font-medium text-[var(--text-primary)]">{activeTasks}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)]">Completed</span>
            <span className="text-xs font-medium text-[var(--text-primary)]">{completedTasks}</span>
          </div>
          <div className="mt-3 bg-[var(--gray-300)] h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ 
                width: `${completedTasks > 0 ? (completedTasks / (activeTasks + completedTasks)) * 100 : 0}%` 
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 