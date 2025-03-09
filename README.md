Personal Life Tracker - Project Requirements Document
Project Overview
The Personal Life Tracker is a comprehensive application designed to help organize and track various aspects of daily life, including tasks, schedules, health routines, and personal care regimens. The application will provide a unified interface for managing these different components while allowing for visualization of progress and adherence to routines.
Core Components
1. Task Management System
Todo List
Create, edit, and delete tasks
Add tags/categories to tasks (e.g., work, personal, health)
Set priority levels (High, Medium, Low)
Mark tasks as complete/incomplete
Filter tasks by tags, priority, and completion status
Search functionality for tasks
2. Schedule Management
Daily Timetable
Visual timeline from 6:30 AM to 10:00 PM
Time slots with customizable duration (30 min, 1 hour, etc.)
Ability to assign tasks from the todo list to specific time slots
Quick-add functionality: adding a task to a time slot automatically adds it to the todo list
Drag and drop interface for rearranging tasks
Daily, weekly, and monthly views
3. Health & Routine Tracking
Tabbed Interface for different routines:
Nutrition & Diet Plan: Markdown editor for meal plans, nutritional guidelines
Exercise Routine: Workout schedules, exercise descriptions, progress tracking
Skin Care Routine: Morning and evening routines, product tracking
Hair Care Routine: Hair care steps, product usage
Chronic Sinusitis Management: Medication schedules, preventative measures, symptom tracking
4. Dashboard & Analytics
User Profile
Visual representation of task completion rates
Routine adherence metrics
Streak tracking for consistent behaviors
Progress charts for health metrics
Summary of upcoming tasks and scheduled activities
Technical Requirements
Frontend
Framework: Next.js with TypeScript
Styling: Tailwind CSS for responsive design
State Management: React Context API or Redux
UI Components:
Calendar/scheduler component
Markdown editor/viewer
Charts and visualization tools
Drag and drop functionality
Backend & Data Storage
Database: Supabase (PostgreSQL)
Authentication: Supabase Auth
Data Models:
Users
Tasks (with tags, priority, status)
Schedule entries
Routine content (markdown documents)
Progress metrics
Data Schema (Supabase)
Users Table
Tasks Table
Task_Tags Table
Schedule_Entries Table
Routines Table
Progress_Metrics Table
User Interface Design
Main Layout
Sidebar navigation for switching between components
Header with profile information and quick actions
Main content area for the active component
Mobile-responsive design
Todo List View
List of tasks with priority indicators
Filter and sort controls
Quick-add task input
Task detail modal/panel
Schedule View
Timeline visualization
Time slot blocks
Task assignment interface
Day/week/month navigation
Routine Tabs
Tab navigation between different routines
Markdown content display with formatting
Edit mode for updating content
Dashboard
Summary cards for key metrics
Progress charts
Recent activity log
Upcoming schedule preview
Implementation Phases
Phase 1: Core Structure & Todo List
Set up Next.js project with Tailwind CSS
Implement Supabase integration
Create basic layout and navigation
Implement todo list functionality (CRUD operations)
Phase 2: Schedule Management
Develop timeline visualization
Implement time slot management
Connect todo list with schedule
Create drag and drop functionality
Phase 3: Routine Tracking
Build tabbed interface for routines
Implement markdown editor and viewer
Create storage for routine content
Develop routine update workflow
Phase 4: Dashboard & Analytics
Design and implement dashboard layout
Create visualization components
Implement progress tracking logic
Connect all components for data visualization
Phase 5: Refinement & Optimization
Improve UI/UX based on usage
Optimize performance
Add additional features as needed
Final testing and bug fixes