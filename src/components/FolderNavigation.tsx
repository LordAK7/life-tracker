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
    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--border)] p-5 bg-[var(--gray-100)]">
      <h3 className="text-sm font-medium text-[var(--gray-600)] uppercase tracking-wider mb-5 px-2">Folders</h3>
      
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className={`text-[var(--text-primary)] font-medium ${activeFolder === 'active' ? 'text-[var(--accent)]' : ''}`}>Active</span>
          </div>
          
          <motion.span 
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
          </motion.span>
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-[var(--text-primary)] font-medium ${activeFolder === 'completed' ? 'text-[var(--accent)]' : ''}`}>Completed</span>
          </div>
          
          <motion.span 
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
          </motion.span>
        </button>
      </div>
    </div>
  );
} 