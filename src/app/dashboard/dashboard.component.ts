import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, InboxItem, Project, ProjectTask } from '../services/data.service';
import { InboxCaptureComponent } from '../shared/inbox-capture/inbox-capture.component';

interface NextAction {
  id: number;
  projectId?: number;
  projectName?: string;
  title: string;
  context?: string;
  status?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InboxCaptureComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  inboxItems: InboxItem[] = [];
  projects: Project[] = [];
  nextActions: NextAction[] = [];
  pomodorosToday = 0;
  pomodorosThisWeek = 0;
  showCapture = false;
  lastReviewDate: Date | null = null;
  showWeeklyReviewPrompt = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
    this.checkWeeklyReview();
  }

  loadData() {
    this.inboxItems = this.dataService.getInboxItems();
    this.projects = this.dataService.getProjects();
    this.loadNextActions();
    this.calculatePomodoroStats();
  }

  get inboxCount(): number {
    return this.inboxItems.length;
  }

  get activeProjects(): Project[] {
    return this.projects.filter(p => p.totalTasks > 0 && p.completedTasks < p.totalTasks);
  }

  get projectsWithoutNextActions(): Project[] {
    return this.activeProjects.filter(project => {
      const tasks = this.dataService.getProjectTasks(project.id);
      const hasNextAction = tasks.some(task => 
        task.status !== 'completed' && 
        task.status !== 'deferred' &&
        (!task.status || task.status === 'not_started' || task.status === 'in_progress')
      );
      return !hasNextAction;
    });
  }

  get nextActionsByContext(): Record<string, NextAction[]> {
    const grouped: Record<string, NextAction[]> = {};
    
    this.nextActions.forEach(action => {
      const context = action.context || 'no-context';
      if (!grouped[context]) {
        grouped[context] = [];
      }
      grouped[context].push(action);
    });

    // Sort contexts: @computer, @phone, @home, @office, then no-context
    const contextOrder = ['computer', 'phone', 'home', 'office', 'no-context'];
    const sorted: Record<string, NextAction[]> = {};
    contextOrder.forEach(ctx => {
      if (grouped[ctx]) {
        sorted[ctx] = grouped[ctx];
      }
    });
    Object.keys(grouped).forEach(ctx => {
      if (!sorted[ctx]) {
        sorted[ctx] = grouped[ctx];
      }
    });

    return sorted;
  }

  loadNextActions() {
    const actions: NextAction[] = [];

    // Get next actions from projects (incomplete, not deferred tasks)
    this.projects.forEach(project => {
      const tasks = this.dataService.getProjectTasks(project.id);
      const incompleteTasks = tasks.filter(task => 
        task.status !== 'completed' && 
        task.status !== 'deferred' &&
        (!task.status || task.status === 'not_started' || task.status === 'in_progress')
      );

      // Get the next action (first incomplete task)
      if (incompleteTasks.length > 0) {
        const nextTask = incompleteTasks[0];
        actions.push({
          id: nextTask.id,
          projectId: project.id,
          projectName: project.name,
          title: nextTask.title,
          context: nextTask.context,
          status: nextTask.status
        });
      }
    });

    this.nextActions = actions;
  }

  calculatePomodoroStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    const day = weekStart.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    weekStart.setDate(today.getDate() + diffToMonday);
    weekStart.setHours(0, 0, 0, 0);

    let todayCount = 0;
    let weekCount = 0;

    this.projects.forEach(project => {
      const tasks = this.dataService.getProjectTasks(project.id);
      tasks.forEach(task => {
        if (task.pomodorosDone && task.pomodorosDone > 0) {
          // For simplicity, we'll count pomodoros done as recent if the task was updated recently
          // In a real app, you'd track when pomodoros were completed
          if (task.createdAt) {
            const createdDate = new Date(task.createdAt);
            if (createdDate >= today) {
              todayCount += task.pomodorosDone;
            }
            if (createdDate >= weekStart) {
              weekCount += task.pomodorosDone;
            }
          }
        }
      });
    });

    this.pomodorosToday = todayCount;
    this.pomodorosThisWeek = weekCount;
  }

  toggleTaskComplete(action: NextAction) {
    if (!action.projectId) return;
    
    const tasks = this.dataService.getProjectTasks(action.projectId);
    const task = tasks.find(t => t.id === action.id);
    if (task) {
      task.status = task.status === 'completed' ? 'not_started' : 'completed';
      
      // Update project completed count
      const project = this.projects.find(p => p.id === action.projectId);
      if (project) {
        project.completedTasks = tasks.filter(t => t.status === 'completed').length;
      }

      this.loadNextActions();
    }
  }

  isTaskComplete(action: NextAction): boolean {
    if (!action.projectId) return false;
    const tasks = this.dataService.getProjectTasks(action.projectId);
    const task = tasks.find(t => t.id === action.id);
    return task?.status === 'completed' || false;
  }

  openCapture() {
    this.showCapture = true;
  }

  closeCapture() {
    this.showCapture = false;
  }

  addItem(text: string) {
    if (!text.trim()) return;
    const newId = Math.max(...this.inboxItems.map(i => i.id), 0) + 1;
    const newItem: InboxItem = {
      id: newId,
      title: text.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.dataService.addInboxItem(newItem);
    this.loadData();
    this.closeCapture();
  }

  checkWeeklyReview() {
    const lastReview = localStorage.getItem('lastWeeklyReview');
    if (lastReview) {
      this.lastReviewDate = new Date(lastReview);
      const daysSinceReview = Math.floor((new Date().getTime() - this.lastReviewDate.getTime()) / (1000 * 60 * 60 * 24));
      this.showWeeklyReviewPrompt = daysSinceReview >= 7;
    } else {
      this.showWeeklyReviewPrompt = true;
    }
  }

  startWeeklyReview() {
    // Store current date as last review
    localStorage.setItem('lastWeeklyReview', new Date().toISOString());
    this.lastReviewDate = new Date();
    this.showWeeklyReviewPrompt = false;
    // Navigate to weekly review page (if exists) or show a modal
    // For now, just hide the prompt
  }

  getContextLabel(context: string): string {
    if (context === 'no-context') return 'No Context';
    return `@${context}`;
  }

  getContextGroups(): Array<{ context: string; actions: NextAction[] }> {
    const grouped = this.nextActionsByContext;
    return Object.keys(grouped).map(context => ({
      context,
      actions: grouped[context]
    }));
  }

  getProgress(project: Project): number {
    if (project.totalTasks === 0) return 0;
    return Math.round((project.completedTasks / project.totalTasks) * 100);
  }

  getDaysSinceReview(): number {
    if (!this.lastReviewDate) return 0;
    return Math.floor((new Date().getTime() - this.lastReviewDate.getTime()) / (1000 * 60 * 60 * 24));
  }
}
