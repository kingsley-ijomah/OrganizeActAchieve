import { Injectable } from '@angular/core';

export interface InboxItem {
  id: number;
  title: string;
  createdAt?: string; // ISO string
}

export interface Project {
  id: number;
  name: string;
  totalTasks: number;
  completedTasks: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private inboxItems: InboxItem[] = [
    { id: 1, title: 'Review project proposal', createdAt: new Date().toISOString() },
    { id: 2, title: 'Email client for feedback' },
    { id: 3, title: 'Plan weekly review' },
    { id: 4, title: 'Organize workspace' },
    { id: 5, title: 'Schedule team meeting' },
    { id: 6, title: 'Update project documentation' },
    { id: 7, title: 'Follow up on pending invoices' },
    { id: 8, title: 'Research new design trends' },
    { id: 9, title: 'Prepare presentation slides' },
    { id: 10, title: 'Review code changes' },
    { id: 11, title: 'Book flight tickets' },
    { id: 12, title: 'Call dentist for appointment' },
    { id: 13, title: 'Buy groceries for the week' },
    { id: 14, title: 'Finish reading book chapter' },
    { id: 15, title: 'Update personal website' },
    { id: 16, title: 'Organize email inbox' },
    { id: 17, title: 'Plan weekend activities' },
    { id: 18, title: 'Review monthly expenses' },
    { id: 19, title: 'Learn new programming language' },
    { id: 20, title: 'Schedule car maintenance' },
    { id: 21, title: 'Write blog post about productivity' },
    { id: 22, title: 'Set up new development environment' },
    { id: 23, title: 'Update resume' },
    { id: 24, title: 'Create project timeline' },
    { id: 25, title: 'Contact potential collaborators' },
    { id: 26, title: 'Review and respond to messages' },
    { id: 27, title: 'Organize digital files' },
    { id: 28, title: 'Plan exercise routine' },
    { id: 29, title: 'Research investment options' },
    { id: 30, title: 'Update software licenses' },
    { id: 31, title: 'Clean up browser bookmarks' },
    { id: 32, title: 'Schedule doctor appointment' },
    { id: 33, title: 'Review subscription services' },
    { id: 34, title: 'Backup important files' },
    { id: 35, title: 'Plan birthday party', createdAt: new Date().toISOString() },
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

  getInboxItems(): InboxItem[] {
    // Ensure createdAt exists for legacy items
    this.inboxItems.forEach(i => { if (!i.createdAt) i.createdAt = new Date().toISOString(); });
    return this.inboxItems;
  }

  getProjects(): Project[] {
    return this.projects;
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
}

