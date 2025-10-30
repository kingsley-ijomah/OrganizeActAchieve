import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService, Project, ProjectTask } from '../services/data.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);

  project: Project | null = null;
  tasks: ProjectTask[] = [];

  // Derived sections
  filter: 'all' | 'today' | 'week' | 'no_due' | 'completed' = 'all';
  get filteredTasks() {
    switch (this.filter) {
      case 'today':
        return this.tasks.filter(t => this.isToday(t.dueDate) && t.status !== 'completed');
      case 'week':
        return this.tasks.filter(t => this.isThisWeek(t.dueDate) && t.status !== 'completed');
      case 'no_due':
        return this.tasks.filter(t => !t.dueDate && t.status !== 'completed');
      case 'completed':
        return this.tasks.filter(t => t.status === 'completed');
      default:
        return this.tasks;
    }
  }

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!isNaN(id)) {
      const project = this.data.getProjects().find(p => p.id === id) || null;
      this.project = project;
      if (project) {
        this.tasks = this.data.getProjectTasks(project.id);
      }
    }
  }

  private isToday(dateIso?: string): boolean {
    if (!dateIso) return false;
    const d = new Date(dateIso); const n = new Date();
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
  }

  private isThisWeek(dateIso?: string): boolean {
    if (!dateIso) return false;
    const d = new Date(dateIso); const n = new Date();
    const day = n.getDay(); const diffToMon = (day === 0 ? -6 : 1) - day;
    const mon = new Date(n); mon.setDate(n.getDate() + diffToMon); mon.setHours(0,0,0,0);
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6); sun.setHours(23,59,59,999);
    return d >= mon && d <= sun;
  }

  toggleComplete(task: ProjectTask) {
    task.status = task.status === 'completed' ? 'not_started' : 'completed';
  }

  deferTask(task: ProjectTask, days: number) {
    const base = task.dueDate ? new Date(task.dueDate) : new Date();
    base.setDate(base.getDate() + days);
    task.dueDate = base.toISOString();
    if (task.status === 'completed') task.status = 'not_started';
  }

  incPomodoro(task: ProjectTask) { task.pomodorosPlanned = (task.pomodorosPlanned || 0) + 1; }
  decPomodoro(task: ProjectTask) { task.pomodorosPlanned = Math.max(0, (task.pomodorosPlanned || 0) - 1); }
  incPomodoroDone(task: ProjectTask) { task.pomodorosDone = (task.pomodorosDone || 0) + 1; }
}
