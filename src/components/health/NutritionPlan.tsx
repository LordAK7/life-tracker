'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Meal {
  id: string;
  title: string;
  time: string;
  options: string[];
  icon: React.ReactNode;
}

export default function NutritionPlan() {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  
  const toggleMeal = (id: string) => {
    if (expandedMeal === id) {
      setExpandedMeal(null);
    } else {
      setExpandedMeal(id);
    }
  };
  
  const meals: Meal[] = [
    {
      id: 'breakfast',
      title: 'Breakfast',
      time: 'After Morning Workout, ~7:45–8:00 AM',
      options: [
        '3 boiled egg whites + 1 whole egg (scrambled/boiled)',
        'Whey Protein Shake (1 scoop)',
        '1 bowl oats or high-fiber cereal',
        'Fruits (Apple/banana/berries)'
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'lunch',
      title: 'Lunch',
      time: '12:45–1:30 PM',
      options: [
        '2–3 Rotis (Whole wheat)',
        'Paneer cooked with minimal oil',
        'Large portion vegetables/salad (cucumber, tomato, carrots)',
        'Low-fat curd (optional)'
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'snack',
      title: 'Snack',
      time: '5:30 PM, after school',
      options: [
        'Fruit smoothie (banana/protein)',
        'Handful of almonds',
        'Green Tea (boost metabolism, helps clear sinus)'
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'dinner',
      title: 'Dinner',
      time: '7:30–8:00 PM',
      options: [
        'Mixed salad bowl with chickpeas/paneer',
        'Stir-fry veggies with tofu/paneer',
        'Avoid heavy carbs at night'
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-1.5 rounded-md bg-[#10b981] bg-opacity-20 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Target Macros</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--gray-100)] p-4 rounded-lg border border-[var(--border)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Calories</span>
              <span className="text-sm font-bold text-[var(--text-primary)]">~1600–1800/day</span>
            </div>
            <div className="w-full bg-[var(--gray-300)] h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#10b981] to-[#059669]"
              />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Caloric deficit for fat loss</p>
          </div>
          
          <div className="bg-[var(--gray-100)] p-4 rounded-lg border border-[var(--border)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Protein</span>
              <span className="text-sm font-bold text-[var(--text-primary)]">~100–120 grams/day</span>
            </div>
            <div className="w-full bg-[var(--gray-300)] h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]"
              />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">For muscle growth and fat loss</p>
          </div>
          
          <div className="bg-[var(--gray-100)] p-4 rounded-lg border border-[var(--border)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Carbs</span>
              <span className="text-sm font-bold text-[var(--text-primary)]">Moderate</span>
            </div>
            <div className="w-full bg-[var(--gray-300)] h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                className="h-full bg-gradient-to-r from-[#f59e0b] to-[#d97706]"
              />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Complex carbs only</p>
          </div>
          
          <div className="bg-[var(--gray-100)] p-4 rounded-lg border border-[var(--border)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Fat</span>
              <span className="text-sm font-bold text-[var(--text-primary)]">Moderate</span>
            </div>
            <div className="w-full bg-[var(--gray-300)] h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '50%' }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                className="h-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb]"
              />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Healthy fats only</p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-1.5 rounded-md bg-[#10b981] bg-opacity-20 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Meal Timings</h2>
        </div>
        
        <div className="space-y-4">
          {meals.map((meal) => (
            <motion.div 
              key={meal.id}
              layout
              className="bg-[var(--gray-100)] rounded-lg border border-[var(--border)] overflow-hidden"
            >
              <motion.button
                onClick={() => toggleMeal(meal.id)}
                className="w-full flex items-center justify-between p-4 text-left"
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center">
                  <div className={`p-1.5 rounded-md ${expandedMeal === meal.id ? 'bg-[#10b981] text-white' : 'bg-[var(--gray-200)] text-[var(--text-secondary)]'} mr-3`}>
                    {meal.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)]">{meal.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">{meal.time}</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedMeal === meal.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[var(--text-secondary)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {expandedMeal === meal.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 border-t border-[var(--border)]">
                      <ul className="space-y-2">
                        {meal.options.map((option, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className="flex items-start"
                          >
                            <div className="text-[#10b981] mr-2 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-sm text-[var(--text-primary)]">{option}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center mb-4">
          <div className="p-1.5 rounded-md bg-[#3b82f6] bg-opacity-20 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Hydration</h2>
        </div>
        
        <div className="bg-[var(--gray-100)] p-4 rounded-lg border border-[var(--border)]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Daily Water Intake</span>
            <span className="text-sm font-bold text-[var(--text-primary)]">Minimum 3 liters</span>
          </div>
          
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#3b82f6] bg-[#3b82f6] bg-opacity-20">
                  Benefits
                </span>
              </div>
            </div>
            <div className="w-full bg-[var(--gray-300)] h-1.5 rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center"
              >
                <div className="text-[#3b82f6] mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--text-primary)]">Clearer skin</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center"
              >
                <div className="text-[#3b82f6] mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--text-primary)]">Reduced sinus congestion</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center"
              >
                <div className="text-[#3b82f6] mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--text-primary)]">Improved metabolism</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center"
              >
                <div className="text-[#3b82f6] mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--text-primary)]">Better digestion</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 