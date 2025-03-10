import { useState, useRef, useEffect } from 'react';
import { Task, Priority } from '@/types/task';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskDetails({ task, onClose, onUpdate, onDelete }: TaskDetailsProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '');
  const [tags, setTags] = useState<string[]>(task.tags);
  const [tagInput, setTagInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        saveChanges();
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        saveChanges();
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [title, description, priority, dueDate, tags]);

  const saveChanges = () => {
    if (
      title !== task.title ||
      description !== task.description ||
      priority !== task.priority ||
      dueDate !== (task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '') ||
      JSON.stringify(tags) !== JSON.stringify(task.tags)
    ) {
      onUpdate({
        ...task,
        title,
        description,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
        tags
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTag();
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleDateButtonClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDueDate('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div 
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="glass-modal rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {isEditing ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              className="w-full text-xl font-medium bg-transparent border-b border-[var(--gray-300)] focus:border-[var(--accent)] pb-1 mb-4 focus:outline-none"
              placeholder="Task title"
            />
          ) : (
            <h2 
              className="text-xl font-medium mb-4 cursor-text" 
              onClick={() => setIsEditing(true)}
            >
              {title || 'Untitled Task'}
            </h2>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--input-border)] focus:border-[var(--accent)] min-h-[100px] resize-none"
                placeholder="Add a description..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--input-border)] focus:border-[var(--accent)] appearance-none"
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, 
                    backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'right 0.5rem center', 
                    backgroundSize: '1.5em 1.5em', 
                    paddingRight: '2.5rem' 
                  }}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Due Date</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleDateButtonClick}
                    className="date-picker-button group"
                  >
                    <span className={dueDate ? 'date-text' : 'placeholder'}>
                      {dueDate ? formatDisplayDate(dueDate) : 'Select date'}
                    </span>
                    <div className="flex items-center">
                      {dueDate && (
                        <button
                          type="button"
                          onClick={handleClearDate}
                          className="mr-1 text-[var(--gray-500)] hover:text-[var(--danger)] transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      <svg xmlns="http://www.w3.org/2000/svg" className="calendar-icon group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </button>
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Tags</label>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-[var(--input-bg)] text-[var(--text-primary)] px-3 py-2 rounded-l-lg border border-[var(--input-border)] focus:border-[var(--accent)]"
                  placeholder="Add a tag"
                />
                <motion.button
                  whileHover={{ backgroundColor: 'var(--accent-hover)' }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addTag}
                  className="bg-[var(--accent)] text-white px-3 py-2 rounded-r-lg transition-colors"
                >
                  Add
                </motion.button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <AnimatePresence>
                  {tags.map((tag, index) => (
                    <motion.div 
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-[var(--gray-200)] text-[var(--gray-600)] px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{tag}</span>
                      <motion.button
                        whileHover={{ color: 'var(--danger)' }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-[var(--gray-500)] focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => onUpdate({ ...task, completed: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${
                  task.completed 
                    ? 'bg-[var(--accent)] border-[var(--accent)]' 
                    : 'border-[var(--gray-400)]'
                }`}>
                  {task.completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-[var(--text-secondary)]">
                  {task.completed ? 'Completed' : 'Mark as completed'}
                </span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <motion.button
              whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => onDelete(task.id)}
              className="text-[var(--danger)] px-3 py-1 rounded-lg transition-colors"
            >
              Delete
            </motion.button>
            
            <motion.button
              whileHover={{ backgroundColor: 'var(--accent-hover)' }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => { saveChanges(); onClose(); }}
              className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Done
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 