'use client';

import NavigationBar from "@/components/NavigationBar";
import { motion } from 'framer-motion';

export default function SchedulePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <NavigationBar />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--border)] overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <div className="w-24 h-24 bg-[var(--accent-light)] rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Coming Soon</h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-md mb-8">
            We're working on an amazing new scheduling experience for you. 
            Check back soon!
          </p>
          <div className="w-full max-w-md h-2 bg-[var(--gray-200)] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[var(--accent)]"
              initial={{ width: "0%" }}
              animate={{ width: "75%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
} 