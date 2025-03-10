'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationBar from "@/components/NavigationBar";
import NutritionPlan from "@/components/health/NutritionPlan";
import MacroTracker from "@/components/health/MacroTracker";
import WaterTracker from "@/components/health/WaterTracker";

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState('nutrition');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const tabs = [
    { id: 'nutrition', label: 'Nutrition Plan' },
    { id: 'macros', label: 'Macro Tracker' },
    { id: 'water', label: 'Water Intake' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <NavigationBar />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--border)] overflow-hidden backdrop-blur-sm bg-opacity-90"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-[#10b981] to-[#059669] p-2 rounded-lg shadow-sm mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Health & Nutrition</h1>
          </div>
          
          <div className="flex border-b border-[var(--border)] mb-6 overflow-x-auto custom-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium text-sm relative transition-colors ${
                  activeTab === tab.id 
                    ? 'text-[var(--accent)]' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
                    initial={false}
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
              </button>
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'nutrition' && <NutritionPlan />}
              {activeTab === 'macros' && <MacroTracker />}
              {activeTab === 'water' && <WaterTracker />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
} 