'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MacroTracker() {
  const [currentDay, setCurrentDay] = useState(new Date());
  const [progress, setProgress] = useState({
    calories: 1250,
    protein: 85,
    carbs: 120,
    fat: 40
  });
  
  const targets = {
    calories: 1800,
    protein: 120,
    carbs: 200,
    fat: 60
  };
  
  const calculatePercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };
  
  const previousDay = () => {
    const newDate = new Date(currentDay);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDay(newDate);
    
    // Simulate different data for different days
    setProgress({
      calories: Math.floor(Math.random() * 1000) + 800,
      protein: Math.floor(Math.random() * 50) + 70,
      carbs: Math.floor(Math.random() * 100) + 100,
      fat: Math.floor(Math.random() * 30) + 30
    });
  };
  
  const nextDay = () => {
    const newDate = new Date(currentDay);
    newDate.setDate(newDate.getDate() + 1);
    
    // Don't allow future dates
    if (newDate <= new Date()) {
      setCurrentDay(newDate);
      
      // Simulate different data for different days
      setProgress({
        calories: Math.floor(Math.random() * 1000) + 800,
        protein: Math.floor(Math.random() * 50) + 70,
        carbs: Math.floor(Math.random() * 100) + 100,
        fat: Math.floor(Math.random() * 30) + 30
      });
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={previousDay}
          className="p-2 rounded-lg bg-[var(--gray-200)] text-[var(--text-secondary)] hover:bg-[var(--gray-300)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-medium text-[var(--text-primary)]">{formatDate(currentDay)}</h3>
        
        <button 
          onClick={nextDay}
          className="p-2 rounded-lg bg-[var(--gray-200)] text-[var(--text-secondary)] hover:bg-[var(--gray-300)] transition-colors"
          disabled={new Date(currentDay).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--gray-100)] rounded-lg border border-[var(--border)] p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-[var(--text-primary)]">Calories</h4>
            <div className="text-right">
              <span className="text-lg font-bold text-[var(--text-primary)]">{progress.calories}</span>
              <span className="text-sm text-[var(--text-secondary)] ml-1">/ {targets.calories}</span>
            </div>
          </div>
          
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#10b981] bg-[#10b981] bg-opacity-20">
                  {calculatePercentage(progress.calories, targets.calories)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-[var(--gray-300)] h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${calculatePercentage(progress.calories, targets.calories)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#10b981] to-[#059669]"
              />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2">Target: 1600-1800 calories/day</p>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-[var(--gray-200)] rounded-lg p-2">
              <p className="text-xs text-[var(--text-secondary)]">Breakfast</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">450 cal</p>
            </div>
            <div className="bg-[var(--gray-200)] rounded-lg p-2">
              <p className="text-xs text-[var(--text-secondary)]">Lunch</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">550 cal</p>
            </div>
            <div className="bg-[var(--gray-200)] rounded-lg p-2">
              <p className="text-xs text-[var(--text-secondary)]">Dinner</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">250 cal</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--gray-100)] rounded-lg border border-[var(--border)] p-4">
          <h4 className="font-medium text-[var(--text-primary)] mb-4">Macronutrients</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-[var(--text-secondary)]">Protein</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{progress.protein}g</span>
                  <span className="text-xs text-[var(--text-secondary)] ml-1">/ {targets.protein}g</span>
                </div>
              </div>
              <div className="w-full bg-[var(--gray-300)] h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${calculatePercentage(progress.protein, targets.protein)}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-[var(--text-secondary)]">Carbs</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{progress.carbs}g</span>
                  <span className="text-xs text-[var(--text-secondary)] ml-1">/ {targets.carbs}g</span>
                </div>
              </div>
              <div className="w-full bg-[var(--gray-300)] h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${calculatePercentage(progress.carbs, targets.carbs)}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                  className="h-full bg-gradient-to-r from-[#f59e0b] to-[#d97706]"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-[var(--text-secondary)]">Fat</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{progress.fat}g</span>
                  <span className="text-xs text-[var(--text-secondary)] ml-1">/ {targets.fat}g</span>
                </div>
              </div>
              <div className="w-full bg-[var(--gray-300)] h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${calculatePercentage(progress.fat, targets.fat)}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb]"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-[var(--gray-300)] relative">
                  <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray={`${calculatePercentage(progress.fat, targets.fat)}, 100`}
                      className="stroke-[#3b82f6]"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray={`${calculatePercentage(progress.carbs, targets.carbs)}, 100`}
                      strokeDashoffset="-25"
                      className="stroke-[#f59e0b]"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#7c3aed"
                      strokeWidth="3"
                      strokeDasharray={`${calculatePercentage(progress.protein, targets.protein)}, 100`}
                      strokeDashoffset="-50"
                      className="stroke-[#7c3aed]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-xs text-[var(--text-secondary)]">Total</span>
                      <p className="text-lg font-bold text-[var(--text-primary)]">{calculatePercentage(progress.calories, targets.calories)}%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-4 text-xs">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#7c3aed] mr-1"></span>
                  <span className="text-[var(--text-secondary)]">Protein</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#f59e0b] mr-1"></span>
                  <span className="text-[var(--text-secondary)]">Carbs</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#3b82f6] mr-1"></span>
                  <span className="text-[var(--text-secondary)]">Fat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-[var(--gray-100)] rounded-lg border border-[var(--border)] p-4">
        <h4 className="font-medium text-[var(--text-primary)] mb-4">Today's Meals</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[var(--gray-200)] rounded-lg">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-[#10b981] bg-opacity-20 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h5 className="font-medium text-[var(--text-primary)]">Breakfast</h5>
                <p className="text-xs text-[var(--text-secondary)]">Eggs, Oats, Fruits</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-[var(--text-primary)]">450 cal</p>
              <p className="text-xs text-[var(--text-secondary)]">P: 30g | C: 45g | F: 15g</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[var(--gray-200)] rounded-lg">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-[#f59e0b] bg-opacity-20 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="font-medium text-[var(--text-primary)]">Lunch</h5>
                <p className="text-xs text-[var(--text-secondary)]">Rotis, Paneer, Vegetables</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-[var(--text-primary)]">550 cal</p>
              <p className="text-xs text-[var(--text-secondary)]">P: 35g | C: 60g | F: 20g</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[var(--gray-200)] rounded-lg">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-[#3b82f6] bg-opacity-20 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="font-medium text-[var(--text-primary)]">Snack</h5>
                <p className="text-xs text-[var(--text-secondary)]">Fruit Smoothie, Almonds</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-[var(--text-primary)]">250 cal</p>
              <p className="text-xs text-[var(--text-secondary)]">P: 10g | C: 25g | F: 10g</p>
            </div>
          </div>
        </div>
        
        <button className="w-full mt-4 p-2 rounded-lg border border-dashed border-[var(--gray-400)] text-[var(--text-secondary)] hover:bg-[var(--gray-200)] transition-colors flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Meal
        </button>
      </div>
    </div>
  );
} 