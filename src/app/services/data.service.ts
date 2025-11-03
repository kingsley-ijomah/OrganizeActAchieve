import { Injectable } from '@angular/core';

export interface InboxItem {
  id: number;
  title: string;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string - last edit time
}

export interface Project {
  id: number;
  name: string;
  totalTasks: number;
  completedTasks: number;
  createdAt?: string; // ISO string
  order?: number; // Order for sorting projects
}

export interface ProjectTask {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  status?: 'not_started' | 'in_progress' | 'completed' | 'deferred';
  context?: 'computer' | 'phone' | 'home' | 'office' | '';
  priority?: 'high' | 'normal' | 'low' | '';
  dueDate?: string; // ISO
  pomodorosPlanned?: number;
  pomodorosDone?: number;
  createdAt?: string;
  parentTaskId?: number; // Parent task ID for hierarchical relationships
  order?: number; // Order for sorting tasks within a project
}

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startDate: string; // ISO date string
  startTime?: string; // ISO time string or HH:mm format
  endDate?: string; // ISO date string (for multi-day events)
  endTime?: string; // ISO time string or HH:mm format
  isAllDay?: boolean;
  location?: string;
  reminderDate?: string; // ISO date string for tickler file
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private static getDateOffset(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  }

  private inboxItems: InboxItem[] = [
    { id: 1, title: 'Review project proposal', createdAt: DataService.getDateOffset(0), updatedAt: DataService.getDateOffset(0) }, // Today
    { id: 2, title: 'Email client for feedback', createdAt: DataService.getDateOffset(1), updatedAt: DataService.getDateOffset(1) }, // 1 day ago
    { id: 3, title: 'Plan weekly review', createdAt: DataService.getDateOffset(2), updatedAt: DataService.getDateOffset(2) }, // 2 days ago
    { id: 4, title: 'Organize workspace', createdAt: DataService.getDateOffset(3), updatedAt: DataService.getDateOffset(3) }, // 3 days ago
    { id: 5, title: 'Schedule team meeting', createdAt: DataService.getDateOffset(5), updatedAt: DataService.getDateOffset(5) }, // 5 days ago
    { id: 6, title: 'Update project documentation', createdAt: DataService.getDateOffset(8), updatedAt: DataService.getDateOffset(8) }, // 1 week ago
    { id: 7, title: 'Follow up on pending invoices', createdAt: DataService.getDateOffset(10), updatedAt: DataService.getDateOffset(10) }, // 1 week ago
    { id: 8, title: 'Research new design trends', createdAt: DataService.getDateOffset(14), updatedAt: DataService.getDateOffset(14) }, // 2 weeks ago
    { id: 9, title: 'Prepare presentation slides', createdAt: DataService.getDateOffset(16), updatedAt: DataService.getDateOffset(16) }, // 2 weeks ago
    { id: 10, title: 'Review code changes', createdAt: DataService.getDateOffset(21), updatedAt: DataService.getDateOffset(21) }, // 3 weeks ago
    { id: 11, title: 'Book flight tickets', createdAt: DataService.getDateOffset(0), updatedAt: DataService.getDateOffset(0) }, // Today
    { id: 12, title: 'Call dentist for appointment', createdAt: DataService.getDateOffset(1), updatedAt: DataService.getDateOffset(1) }, // 1 day ago
    { id: 13, title: 'Buy groceries for the week', createdAt: DataService.getDateOffset(4), updatedAt: DataService.getDateOffset(4) }, // 4 days ago
    { id: 14, title: 'Finish reading book chapter', createdAt: DataService.getDateOffset(6), updatedAt: DataService.getDateOffset(6) }, // 6 days ago
    { id: 15, title: 'Update personal website', createdAt: DataService.getDateOffset(9), updatedAt: DataService.getDateOffset(9) }, // 1 week ago
    { id: 16, title: 'Organize email inbox', createdAt: DataService.getDateOffset(12), updatedAt: DataService.getDateOffset(12) }, // 1 week ago
    { id: 17, title: 'Plan weekend activities', createdAt: DataService.getDateOffset(15), updatedAt: DataService.getDateOffset(15) }, // 2 weeks ago
    { id: 18, title: 'Review monthly expenses', createdAt: DataService.getDateOffset(18), updatedAt: DataService.getDateOffset(18) }, // 2 weeks ago
    { id: 19, title: 'Learn new programming language', createdAt: DataService.getDateOffset(22), updatedAt: DataService.getDateOffset(22) }, // 3 weeks ago
    { id: 20, title: 'Schedule car maintenance', createdAt: DataService.getDateOffset(25), updatedAt: DataService.getDateOffset(25) }, // 3 weeks ago
    { id: 21, title: 'Write blog post about productivity', createdAt: DataService.getDateOffset(30), updatedAt: DataService.getDateOffset(30) }, // 1 month ago
    { id: 22, title: 'Set up new development environment', createdAt: DataService.getDateOffset(35), updatedAt: DataService.getDateOffset(35) }, // 1 month ago
    { id: 23, title: 'Update resume', createdAt: DataService.getDateOffset(45), updatedAt: DataService.getDateOffset(45) }, // 1 month ago
    { id: 24, title: 'Create project timeline', createdAt: DataService.getDateOffset(50), updatedAt: DataService.getDateOffset(50) }, // 1 month ago
    { id: 25, title: 'Contact potential collaborators', createdAt: DataService.getDateOffset(60), updatedAt: DataService.getDateOffset(60) }, // 2 months ago
    { id: 26, title: 'Review and respond to messages', createdAt: DataService.getDateOffset(75), updatedAt: DataService.getDateOffset(75) }, // 2 months ago
    { id: 27, title: 'Organize digital files', createdAt: DataService.getDateOffset(90), updatedAt: DataService.getDateOffset(90) }, // 3 months ago
    { id: 28, title: 'Plan exercise routine', createdAt: DataService.getDateOffset(2), updatedAt: DataService.getDateOffset(2) }, // 2 days ago
    { id: 29, title: 'Research investment options', createdAt: DataService.getDateOffset(7), updatedAt: DataService.getDateOffset(7) }, // 1 week ago
    { id: 30, title: 'Update software licenses', createdAt: DataService.getDateOffset(13), updatedAt: DataService.getDateOffset(13) }, // 1 week ago
    { id: 31, title: 'Clean up browser bookmarks', createdAt: DataService.getDateOffset(20), updatedAt: DataService.getDateOffset(20) }, // 2 weeks ago
    { id: 32, title: 'Schedule doctor appointment', createdAt: DataService.getDateOffset(28), updatedAt: DataService.getDateOffset(28) }, // 4 weeks ago (1 month)
    { id: 33, title: 'Review subscription services', createdAt: DataService.getDateOffset(40), updatedAt: DataService.getDateOffset(40) }, // 1 month ago
    { id: 34, title: 'Backup important files', createdAt: DataService.getDateOffset(55), updatedAt: DataService.getDateOffset(55) }, // 1 month ago
    { id: 35, title: 'Plan birthday party', createdAt: DataService.getDateOffset(0), updatedAt: DataService.getDateOffset(0) }, // Today
  ];

  private projects: Project[] = [
    { id: 1, name: 'Website Redesign', totalTasks: 15, completedTasks: 8 },
    { id: 2, name: 'Mobile App Development', totalTasks: 32, completedTasks: 12 },
    { id: 3, name: 'Marketing Campaign', totalTasks: 24, completedTasks: 18 },
    { id: 4, name: 'Q4 Product Launch', totalTasks: 45, completedTasks: 30 },
    { id: 5, name: 'Customer Research', totalTasks: 12, completedTasks: 7 },
    { id: 6, name: 'Team Training Program', totalTasks: 20, completedTasks: 15 },
    { id: 7, name: 'Infrastructure Upgrade', totalTasks: 28, completedTasks: 10 },
    { id: 8, name: 'Content Strategy', totalTasks: 18, completedTasks: 12 },
    { id: 9, name: 'Brand Identity Refresh', totalTasks: 22, completedTasks: 14 },
    { id: 10, name: 'User Experience Audit', totalTasks: 16, completedTasks: 9 },
    { id: 11, name: 'Analytics Implementation', totalTasks: 14, completedTasks: 6 },
    { id: 12, name: 'Social Media Strategy', totalTasks: 19, completedTasks: 11 },
    { id: 13, name: 'Email Automation', totalTasks: 11, completedTasks: 8 },
    { id: 14, name: 'Customer Onboarding', totalTasks: 26, completedTasks: 17 },
    { id: 15, name: 'Documentation Update', totalTasks: 13, completedTasks: 10 },
    { id: 16, name: 'Security Review', totalTasks: 17, completedTasks: 5 },
    { id: 17, name: 'Performance Optimization', totalTasks: 21, completedTasks: 13 },
    { id: 18, name: 'API Integration', totalTasks: 23, completedTasks: 16 },
    { id: 19, name: 'Database Migration', totalTasks: 29, completedTasks: 20 },
    { id: 20, name: 'Testing Framework', totalTasks: 15, completedTasks: 12 },
  ];

  // Simple in-memory task store per project
  private projectIdToTasks: Record<number, ProjectTask[]> = {
    1: [
      { id: 1, projectId: 1, title: 'Comprehensive audit and performance analysis of current website infrastructure including user experience metrics', status: 'in_progress', context: 'computer', priority: 'high', dueDate: this.isoOffset(1), pomodorosPlanned: 4, pomodorosDone: 2, createdAt: this.isoOffset(-2), description: 'Perform a thorough review of the existing website, analyzing page load times, accessibility compliance, SEO metrics, and user interaction patterns. Document all findings with actionable recommendations.' },
      { id: 2, projectId: 1, title: 'Define comprehensive color palette and design system tokens for brand consistency', status: 'not_started', context: 'computer', priority: 'normal', dueDate: this.isoOffset(5), pomodorosPlanned: 3, pomodorosDone: 0, createdAt: this.isoOffset(-1), description: 'Create a cohesive color system that aligns with brand guidelines, including primary, secondary, and accent colors with light and dark mode variations.' },
      { id: 5, projectId: 1, title: 'Conduct user interviews and gather qualitative feedback on current product experience', status: 'not_started', context: 'phone', priority: 'low', dueDate: this.isoOffset(0), pomodorosPlanned: 2, pomodorosDone: 0, createdAt: this.isoOffset(-1), description: 'Schedule and conduct interviews with 10-15 target users to understand pain points, desired features, and overall satisfaction with the current design.' },
      { id: 6, projectId: 1, title: 'Create detailed wireframes and user flow diagrams for new checkout process', status: 'not_started', context: 'computer', priority: 'high', dueDate: this.isoOffset(3), pomodorosPlanned: 4, pomodorosDone: 0, createdAt: this.isoOffset(-1), description: 'Design low-fidelity wireframes for the entire checkout experience, including cart review, payment method selection, shipping options, and order confirmation screens.' },
      { id: 7, projectId: 1, title: 'Prepare comprehensive stakeholder presentation deck with project updates and timeline', status: 'in_progress', context: 'computer', priority: 'normal', pomodorosPlanned: 3, pomodorosDone: 1, createdAt: this.isoOffset(-2), description: 'Compile progress updates, key metrics, design decisions, and next steps into a presentation format suitable for executive review and stakeholder alignment.' },
      { id: 8, projectId: 1, title: 'Export design tokens and component specifications for development handoff', status: 'completed', context: 'computer', priority: 'normal', dueDate: this.isoOffset(-1), pomodorosPlanned: 1, pomodorosDone: 1, createdAt: this.isoOffset(-3), description: 'Extract all design tokens (colors, spacing, typography) and component specifications from Figma and prepare them in a format that developers can easily implement.' },
    ],
    2: [
      { id: 3, projectId: 2, title: 'Implement secure authentication flow with multi-factor authentication support', status: 'completed', context: 'computer', priority: 'high', dueDate: this.isoOffset(-1), pomodorosPlanned: 4, pomodorosDone: 4, createdAt: this.isoOffset(-7), description: 'Build complete authentication system including login, registration, password reset, and MFA options using secure token-based authentication.' },
      { id: 4, projectId: 2, title: 'Design and implement comprehensive onboarding experience for new users', status: 'not_started', context: 'phone', priority: 'normal', pomodorosPlanned: 2, pomodorosDone: 0, createdAt: this.isoOffset(-3), description: 'Create engaging onboarding screens that introduce key features, guide users through initial setup, and help them understand how to get the most value from the app.' },
      { id: 9, projectId: 2, title: 'Implement system-wide dark mode with theme switching capabilities', status: 'not_started', context: 'computer', priority: 'low', dueDate: this.isoOffset(0), pomodorosPlanned: 2, pomodorosDone: 0, createdAt: this.isoOffset(-1), description: 'Add dark mode support across all screens with proper contrast ratios, smooth transitions, and user preference persistence.' },
      { id: 10, projectId: 2, title: 'Integrate crash reporting and analytics tools for production monitoring', status: 'not_started', context: 'computer', priority: 'high', dueDate: this.isoOffset(6), pomodorosPlanned: 3, pomodorosDone: 0, createdAt: this.isoOffset(-1), description: 'Set up Sentry for crash reporting, configure error tracking, and implement analytics to monitor app performance and user behavior in production.' },
      { id: 11, projectId: 2, title: 'Design multiple app icon variants for A/B testing and market differentiation', status: 'in_progress', context: 'computer', priority: 'normal', pomodorosPlanned: 2, pomodorosDone: 1, createdAt: this.isoOffset(-2), description: 'Create several app icon options with different styles and color schemes to test user preference and improve app store conversion rates.' },
    ],
    3: [
      { id: 12, projectId: 3, title: 'Identify and segment target audience personas for personalized marketing campaigns', status: 'not_started', context: 'computer', priority: 'high', dueDate: this.isoOffset(2), pomodorosPlanned: 3, pomodorosDone: 0, createdAt: this.isoOffset(-1), description: 'Analyze user data to create detailed audience segments based on demographics, behavior patterns, purchase history, and engagement levels for targeted messaging.' },
      { id: 13, projectId: 3, title: 'Draft compelling email campaign copy for product launch announcement', status: 'not_started', context: 'computer', priority: 'normal', dueDate: this.isoOffset(0), pomodorosPlanned: 2, pomodorosDone: 0, createdAt: this.isoOffset(-1), description: 'Write engaging email content that highlights key product features, benefits, and includes clear call-to-action buttons to drive conversions.' },
      { id: 14, projectId: 3, title: 'Set up UTM tracking links for all campaign channels and monitor performance', status: 'completed', context: 'computer', priority: 'low', pomodorosPlanned: 1, pomodorosDone: 1, createdAt: this.isoOffset(-4), description: 'Generate and organize UTM parameters for email, social media, and paid advertising campaigns to track campaign effectiveness and attribution.' },
    ],
  };

  private isoOffset(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }

  getInboxItems(): InboxItem[] {
    // Ensure createdAt exists for legacy items
    this.inboxItems.forEach(i => { if (!i.createdAt) i.createdAt = new Date().toISOString(); });
    // Sort by createdAt descending (newest first)
    return [...this.inboxItems].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Descending order
    });
  }

  getProjects(): Project[] {
    // Ensure createdAt exists for legacy projects
    this.projects.forEach((p, index) => { 
      if (!p.createdAt) {
        p.createdAt = new Date().toISOString();
      }
      // Initialize order if not set
      if (p.order === undefined) {
        p.order = index;
      }
    });
    // Sort by order first, then by createdAt descending (newest first)
    return [...this.projects].sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : Infinity;
      const orderB = b.order !== undefined ? b.order : Infinity;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // If orders are equal or both undefined, sort by createdAt
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Descending order
    });
  }

  getProjectTasks(projectId: number): ProjectTask[] {
    const tasks = this.projectIdToTasks[projectId] || [];
    // Initialize order for tasks that don't have it
    let maxOrder = 0;
    tasks.forEach((task, index) => {
      if (task.order === undefined) {
        task.order = index;
        maxOrder = Math.max(maxOrder, index);
      } else {
        maxOrder = Math.max(maxOrder, task.order);
      }
    });
    // Ensure pomodoros don't exceed max of 4 and return sorted by order
    const processedTasks = tasks.map(task => ({
      ...task,
      pomodorosPlanned: task.pomodorosPlanned != null ? Math.min(4, Math.max(0, task.pomodorosPlanned)) : undefined,
      pomodorosDone: task.pomodorosDone != null ? Math.min(4, Math.max(0, task.pomodorosDone)) : undefined,
      order: task.order !== undefined ? task.order : (maxOrder + 1)
    }));
    // Sort by order, then by createdAt for tasks without order
    return processedTasks.sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : Infinity;
      const orderB = b.order !== undefined ? b.order : Infinity;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // If orders are equal or both undefined, sort by createdAt
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    });
  }

  addTaskToProjectWithDetails(projectId: number, task: Omit<ProjectTask, 'id' | 'projectId'>) {
    const list = this.projectIdToTasks[projectId] || (this.projectIdToTasks[projectId] = []);
    const newId = Math.max(0, ...Object.values(this.projectIdToTasks).flat().map(t => t.id)) + 1;
    // Cap pomodoros at 4 (max allowed)
    const pomodorosPlanned = task.pomodorosPlanned != null ? Math.min(4, Math.max(0, task.pomodorosPlanned)) : undefined;
    const pomodorosDone = task.pomodorosDone != null ? Math.min(4, Math.max(0, task.pomodorosDone)) : undefined;
    // Set order to end of list (highest order + 1, or 0 if list is empty)
    const maxOrder = list.length > 0 ? Math.max(...list.map(t => t.order !== undefined ? t.order : -1)) : -1;
    list.push({ 
      id: newId, 
      projectId, 
      title: task.title, 
      status: task.status, 
      description: task.description, 
      context: task.context, 
      priority: task.priority, 
      dueDate: task.dueDate, 
      pomodorosPlanned, 
      pomodorosDone, 
      parentTaskId: task.parentTaskId,
      createdAt: new Date().toISOString(),
      order: maxOrder + 1
    });
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      project.totalTasks = (project.totalTasks || 0) + 1;
    }
  }

  updateTaskOrder(projectId: number, taskId: number, newOrder: number): void {
    const tasks = this.projectIdToTasks[projectId];
    if (!tasks) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const oldOrder = task.order !== undefined ? task.order : Infinity;
    task.order = newOrder;
    
    // Reorder other tasks: if moving down, decrease order of tasks between old and new position
    // If moving up, increase order of tasks between new and old position
    tasks.forEach(t => {
      if (t.id === taskId) return;
      
      const currentOrder = t.order !== undefined ? t.order : Infinity;
      
      if (oldOrder < newOrder) {
        // Moving down: decrease order of tasks between oldOrder and newOrder
        if (currentOrder > oldOrder && currentOrder <= newOrder) {
          t.order = (t.order !== undefined ? t.order : Infinity) - 1;
        }
      } else if (oldOrder > newOrder) {
        // Moving up: increase order of tasks between newOrder and oldOrder
        if (currentOrder >= newOrder && currentOrder < oldOrder) {
          t.order = (t.order !== undefined ? t.order : Infinity) + 1;
        }
      }
    });
  }

  updateTaskOrders(projectId: number, taskOrders: Array<{ id: number; order: number }>): void {
    const tasks = this.projectIdToTasks[projectId];
    if (!tasks) return;
    
    // Create a map for quick lookup
    const orderMap = new Map(taskOrders.map(to => [to.id, to.order]));
    
    // Update all task orders
    tasks.forEach(task => {
      if (orderMap.has(task.id)) {
        task.order = orderMap.get(task.id);
      }
    });
  }

  updateProjectName(id: number, name: string) {
    const p = this.projects.find(p => p.id === id);
    if (p) p.name = name;
  }

  updateProjectOrders(projectOrders: Array<{ id: number; order: number }>): void {
    // Create a map for quick lookup
    const orderMap = new Map(projectOrders.map(po => [po.id, po.order]));
    
    // Update all project orders
    this.projects.forEach(project => {
      if (orderMap.has(project.id)) {
        project.order = orderMap.get(project.id);
      }
    });
  }

  removeInboxItem(itemId: number): void {
    const index = this.inboxItems.findIndex(item => item.id === itemId);
    if (index > -1) {
      this.inboxItems.splice(index, 1);
    }
  }

  addTaskToProject(item: InboxItem, projectId: number): void {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      project.totalTasks++;
      // Remove from inbox
      this.removeInboxItem(item.id);
    }
  }

  addProject(project: Project): void {
    // Set order to end of list (highest order + 1, or 0 if list is empty)
    const maxOrder = this.projects.length > 0 ? Math.max(...this.projects.map(p => p.order !== undefined ? p.order : -1)) : -1;
    project.order = maxOrder + 1;
    this.projects.push(project);
  }

  deleteProject(projectId: number): void {
    const index = this.projects.findIndex(p => p.id === projectId);
    if (index > -1) {
      this.projects.splice(index, 1);
    }
  }

  addInboxItem(item: InboxItem): void {
    this.inboxItems.push(item);
  }

  // Calendar Events
  private calendarEvents: CalendarEvent[] = [
    {
      id: 1,
      title: 'Team Standup',
      description: 'Daily team synchronization meeting',
      startDate: this.getTodayISO(),
      startTime: '09:00',
      endTime: '09:30',
      isAllDay: false,
      location: 'Conference Room A',
      createdAt: DataService.getDateOffset(2)
    },
    {
      id: 2,
      title: 'Client Presentation',
      description: 'Present quarterly results to stakeholders',
      startDate: this.getDateOffset(3),
      startTime: '14:00',
      endTime: '15:30',
      isAllDay: false,
      location: 'Main Conference Room',
      createdAt: DataService.getDateOffset(5)
    },
    {
      id: 3,
      title: 'Project Deadline',
      description: 'Final deliverable submission',
      startDate: this.getDateOffset(7),
      isAllDay: true,
      createdAt: DataService.getDateOffset(10)
    },
    {
      id: 4,
      title: 'Doctor Appointment',
      description: 'Annual checkup',
      startDate: this.getDateOffset(1),
      startTime: '11:00',
      endTime: '11:30',
      isAllDay: false,
      createdAt: DataService.getDateOffset(14)
    },
    {
      id: 5,
      title: 'Team Building Event',
      description: 'Company offsite activity',
      startDate: this.getDateOffset(14),
      endDate: this.getDateOffset(15),
      isAllDay: true,
      location: 'Resort Location',
      createdAt: DataService.getDateOffset(20)
    },
    {
      id: 6,
      title: 'Review Quarterly Goals',
      reminderDate: this.getDateOffset(21),
      startDate: this.getDateOffset(21),
      isAllDay: true,
      createdAt: DataService.getDateOffset(30)
    }
  ];

  private getTodayISO(): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
  }

  private getDateOffset(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }

  getCalendarEvents(startDate?: string, endDate?: string): CalendarEvent[] {
    let events = [...this.calendarEvents];
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      events = events.filter(event => {
        const eventStart = new Date(event.startDate);
        const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
        return (eventStart >= start && eventStart <= end) || 
               (eventEnd >= start && eventEnd <= end) ||
               (eventStart <= start && eventEnd >= end);
      });
    }
    
    // Also include tasks with due dates
    const allProjects = this.getProjects();
    allProjects.forEach(project => {
      const tasks = this.getProjectTasks(project.id);
      tasks.forEach(task => {
        if (task.dueDate && task.status !== 'completed') {
          const dueDate = new Date(task.dueDate);
          if (!startDate || !endDate || (dueDate >= new Date(startDate) && dueDate <= new Date(endDate))) {
            events.push({
              id: -task.id, // Use negative ID to distinguish from regular events
              title: task.title,
              description: `From project: ${project.name}`,
              startDate: task.dueDate,
              isAllDay: true,
              createdAt: task.createdAt
            });
          }
        }
      });
    });
    
    return events.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA.getTime() - dateB.getTime();
    });
  }

  getEventsForDate(date: string): CalendarEvent[] {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    const nextDay = new Date(dateObj);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return this.getCalendarEvents(dateObj.toISOString(), nextDay.toISOString());
  }

  getTicklerItems(): CalendarEvent[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.calendarEvents.filter(event => {
      if (!event.reminderDate) return false;
      const reminderDate = new Date(event.reminderDate);
      reminderDate.setHours(0, 0, 0, 0);
      return reminderDate <= today;
    });
  }

  addCalendarEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const newId = Math.max(0, ...this.calendarEvents.map(e => typeof e.id === 'number' ? e.id : 0)) + 1;
    const newEvent: CalendarEvent = {
      ...event,
      id: newId,
      createdAt: event.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.calendarEvents.push(newEvent);
    return newEvent;
  }

  updateCalendarEvent(id: number, updates: Partial<CalendarEvent>): void {
    const event = this.calendarEvents.find(e => e.id === id);
    if (event) {
      Object.assign(event, updates);
      event.updatedAt = new Date().toISOString();
    }
  }

  deleteCalendarEvent(id: number): void {
    this.calendarEvents = this.calendarEvents.filter(e => e.id !== id);
  }
}

