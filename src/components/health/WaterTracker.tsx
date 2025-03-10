'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WaterTracker() {
  const [currentDay, setCurrentDay] = useState(new Date());
  const [waterIntake, setWaterIntake] = useState(0); // in ml
  const [waterGoal, setWaterGoal] = useState(3000); // 3 liters
  const [waterHistory, setWaterHistory] = useState<{[key: string]: number}>({});
  const [isAddingWater, setIsAddingWater] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  
  // Initialize water history on component mount
  useEffect(() => {
    const today = formatDateKey(new Date());
    if (!waterHistory[today]) {
      setWaterHistory(prev => ({
        ...prev,
        [today]: 0
      }));
    } else {
      setWaterIntake(waterHistory[today]);
    }
  }, []);
  
  // Update water intake when day changes
  useEffect(() => {
    const dateKey = formatDateKey(currentDay);
    if (waterHistory[dateKey] !== undefined) {
      setWaterIntake(waterHistory[dateKey]);
    } else {
      setWaterIntake(0);
      setWaterHistory(prev => ({
        ...prev,
        [dateKey]: 0
      }));
    }
  }, [currentDay]);
  
  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };
  
  const previousDay = () => {
    const newDate = new Date(currentDay);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDay(newDate);
  };
  
  const nextDay = () => {
    const newDate = new Date(currentDay);
    newDate.setDate(newDate.getDate() + 1);
    
    // Don't allow future dates
    if (newDate <= new Date()) {
      setCurrentDay(newDate);
    }
  };
  
  const addWater = (amount: number) => {
    const newIntake = waterIntake + amount;
    setWaterIntake(newIntake);
    
    const dateKey = formatDateKey(currentDay);
    setWaterHistory(prev => ({
      ...prev,
      [dateKey]: newIntake
    }));
  };
  
  const resetWater = () => {
    setWaterIntake(0);
    
    const dateKey = formatDateKey(currentDay);
    setWaterHistory(prev => ({
      ...prev,
      [dateKey]: 0
    }));
  };
  
  const handleCustomAmountSubmit = () => {
    const amount = parseInt(customAmount);
    if (!isNaN(amount) && amount > 0) {
      addWater(amount);
      setCustomAmount('');
      setIsAddingWater(false);
    }
  };
  
  const calculatePercentage = () => {
    return Math.min(Math.round((waterIntake / waterGoal) * 100), 100);
  };
  
  const getWaterLevelHeight = () => {
    return `${Math.min((waterIntake / waterGoal) * 100, 100)}%`;
  };
  
  const getWaterColor = () => {
    const percentage = calculatePercentage();
    if (percentage < 25) return 'from-[#3b82f6]/30 to-[#3b82f6]/50';
    if (percentage < 50) return 'from-[#3b82f6]/50 to-[#3b82f6]/70';
    if (percentage < 75) return 'from-[#3b82f6]/70 to-[#3b82f6]/80';
    return 'from-[#3b82f6]/80 to-[#3b82f6]';
  };
  
  const getStatusMessage = () => {
    const percentage = calculatePercentage();
    if (percentage === 0) return 'Start drinking!';
    if (percentage < 25) return 'Keep drinking!';
    if (percentage < 50) return 'Good progress!';
    if (percentage < 75) return 'Well done!';
    if (percentage < 100) return 'Almost there!';
    return 'Goal achieved! 🎉';
  };
  
  const waterOptions = [
    { amount: 250, label: 'Glass', icon: '🥛' },
    { amount: 500, label: 'Bottle', icon: '🍶' },
    { amount: 1000, label: 'Liter', icon: '💧' }
  ];
  
  const weeklyData = [
    { day: 'Mon', amount: 2500, goal: 3000 },
    { day: 'Tue', amount: 2800, goal: 3000 },
    { day: 'Wed', amount: 3000, goal: 3000 },
    { day: 'Thu', amount: 2200, goal: 3000 },
    { day: 'Fri', amount: 2700, goal: 3000 },
    { day: 'Sat', amount: 1800, goal: 3000 },
    { day: 'Sun', amount: waterIntake, goal: waterGoal }
  ];
  
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
            <h4 className="font-medium text-[var(--text-primary)]">Water Intake</h4>
            <div className="flex items-center">
              <button 
                onClick={resetWater}
                className="p-1.5 rounded-md text-[var(--text-secondary)] hover:bg-[var(--gray-200)] hover:text-[var(--danger)] transition-colors mr-2"
                title="Reset water intake"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <div className="text-right">
                <span className="text-lg font-bold text-[var(--text-primary)]">{(waterIntake / 1000).toFixed(1)}L</span>
                <span className="text-sm text-[var(--text-secondary)] ml-1">/ {(waterGoal / 1000).toFixed(1)}L</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-64 bg-[var(--gray-200)] rounded-2xl border-2 border-[var(--gray-300)] overflow-hidden">
              <motion.div 
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getWaterColor()} rounded-b-xl`}
                initial={{ height: 0 }}
                animate={{ height: getWaterLevelHeight() }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="absolute top-0 left-0 right-0 h-3 bg-white/20 rounded-full"></div>
              </motion.div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-4xl font-bold text-[var(--text-primary)]">{calculatePercentage()}%</span>
                <span className="text-sm text-[var(--text-secondary)] mt-1">{getStatusMessage()}</span>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-2xl"
                  >
                    💧
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {waterOptions.map((option) => (
              <motion.button
                key={option.amount}
                onClick={() => addWater(option.amount)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center justify-center p-3 bg-[var(--gray-200)] rounded-lg hover:bg-[var(--gray-300)] transition-colors"
              >
                <span className="text-xl mb-1">{option.icon}</span>
                <span className="text-xs text-[var(--text-secondary)]">{option.label}</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">{option.amount}ml</span>
              </motion.button>
            ))}
          </div>
          
          <div className="relative">
            {isAddingWater ? (
              <div className="flex items-center">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount in ml"
                  className="flex-1 p-2 bg-[var(--gray-200)] rounded-l-lg border border-[var(--gray-300)] focus:border-[var(--accent)] text-[var(--text-primary)]"
                  min="1"
                  autoFocus
                />
                <button
                  onClick={handleCustomAmountSubmit}
                  className="p-2 bg-[var(--accent)] text-white rounded-r-lg hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAddingWater(false)}
                  className="p-2 ml-2 bg-[var(--gray-300)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--gray-400)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingWater(true)}
                className="w-full p-2 rounded-lg border border-dashed border-[var(--gray-400)] text-[var(--text-secondary)] hover:bg-[var(--gray-200)] transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Custom Amount
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-[var(--gray-100)] rounded-lg border border-[var(--border)] p-4">
          <h4 className="font-medium text-[var(--text-primary)] mb-4">Weekly Progress</h4>
          
          <div className="h-48 flex items-end justify-between space-x-2 mb-2">
            {weeklyData.map((day, index) => {
              const percentage = Math.min(Math.round((day.amount / day.goal) * 100), 100);
              const isToday = index === weeklyData.length - 1;
              
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full h-full flex items-end">
                    <motion.div 
                      className={`w-full rounded-t-md ${
                        isToday 
                          ? 'bg-[var(--accent)]' 
                          : percentage >= 100 
                            ? 'bg-[#10b981]' 
                            : 'bg-[#3b82f6]'
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: `${(percentage / 100) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                    {isToday && (
                      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-white"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex-1 text-center">
                <span className="text-xs font-medium text-[var(--text-secondary)]">{day.day}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h5 className="text-sm font-medium text-[var(--text-primary)] mb-2">Benefits of Proper Hydration</h5>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="text-[#3b82f6] mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs text-[var(--text-primary)]">Clearer skin and reduced sinus congestion</p>
              </div>
              <div className="flex items-start">
                <div className="text-[#3b82f6] mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs text-[var(--text-primary)]">Improved metabolism and digestion</p>
              </div>
              <div className="flex items-start">
                <div className="text-[#3b82f6] mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs text-[var(--text-primary)]">Better cognitive function and energy levels</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-[var(--gray-100)] rounded-lg border border-[var(--border)] p-4">
        <div className="flex items-center mb-4">
          <div className="p-1.5 rounded-md bg-[#3b82f6] bg-opacity-20 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="font-medium text-[var(--text-primary)]">Hydration Tips</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--gray-200)] p-3 rounded-lg">
            <h5 className="text-sm font-medium text-[var(--text-primary)] mb-1">Morning Routine</h5>
            <p className="text-xs text-[var(--text-secondary)]">Start your day with a glass of water to kickstart metabolism and rehydrate after sleep.</p>
          </div>
          
          <div className="bg-[var(--gray-200)] p-3 rounded-lg">
            <h5 className="text-sm font-medium text-[var(--text-primary)] mb-1">Carry a Water Bottle</h5>
            <p className="text-xs text-[var(--text-secondary)]">Keep a reusable water bottle with you throughout the day as a visual reminder to drink.</p>
          </div>
          
          <div className="bg-[var(--gray-200)] p-3 rounded-lg">
            <h5 className="text-sm font-medium text-[var(--text-primary)] mb-1">Set Reminders</h5>
            <p className="text-xs text-[var(--text-secondary)]">Use phone reminders or apps to alert you to drink water regularly throughout the day.</p>
          </div>
          
          <div className="bg-[var(--gray-200)] p-3 rounded-lg">
            <h5 className="text-sm font-medium text-[var(--text-primary)] mb-1">Infuse Your Water</h5>
            <p className="text-xs text-[var(--text-secondary)]">Add fruits, vegetables, or herbs to your water for natural flavor without added sugars.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 