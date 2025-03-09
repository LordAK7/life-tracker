'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
};

export default function NavigationBar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('tasks');

  // Update active tab based on current path
  useEffect(() => {
    if (pathname === '/') {
      setActiveTab('tasks');
    } else {
      const path = pathname.split('/')[1];
      setActiveTab(path);
    }
  }, [pathname]);

  const navItems: NavItem[] = [
    {
      id: 'tasks',
      label: 'Tasks',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      href: '/'
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/schedule'
    },
    {
      id: 'health',
      label: 'Health',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      href: '/health'
    },
    {
      id: 'routines',
      label: 'Routines',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      href: '/routines'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/dashboard'
    }
  ];

  return (
    <div className="bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border)] p-2 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 px-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span className="text-lg font-medium text-[var(--text-primary)] hidden sm:inline">Life Tracker</span>
        </div>
        
        <nav className="flex items-center">
          {navItems.map((item) => (
            <Link 
              key={item.id}
              href={item.href}
              className="relative px-3 py-2 rounded-lg group"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[var(--accent-light)] rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <div className={`p-2 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'text-[var(--accent)]' 
                      : 'text-[var(--gray-500)] group-hover:text-[var(--text-primary)]'
                  }`}>
                    {item.icon}
                  </div>
                </div>
                <span className={`text-xs mt-1 transition-colors ${
                  activeTab === item.id 
                    ? 'text-[var(--accent)]' 
                    : 'text-[var(--gray-500)] group-hover:text-[var(--text-primary)]'
                }`}>
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-2 px-3">
          <button className="p-2 rounded-full bg-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--gray-300)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-medium text-sm">
            A
          </div>
        </div>
      </div>
    </div>
  );
} 