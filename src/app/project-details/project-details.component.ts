import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProgressStatComponent } from '../shared/progress-stat/progress-stat.component';
import { FormsModule } from '@angular/forms';
import { NumberAdjustModalComponent } from '../shared/number-adjust-modal/number-adjust-modal.component';
import { TaskEditModalComponent, TaskEditModel } from '../shared/task-edit-modal/task-edit-modal.component';
import { DataService, Project, ProjectTask } from '../services/data.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProgressStatComponent, NumberAdjustModalComponent, TaskEditModalComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);

  project: Project | null = null;
  tasks: ProjectTask[] = [];
  editingTitle = false;
  editableTitle = '';

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
        this.editableTitle = project.name;
        this.tasks = this.data.getProjectTasks(project.id);
      }
    }
  }

  isToday(dateIso?: string): boolean {
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

  startEditTitle() { this.editingTitle = true; }
  cancelEditTitle() { this.editingTitle = false; this.editableTitle = this.project?.name || ''; }
  saveTitle() {
    if (this.project && this.editableTitle.trim()) {
      this.data.updateProjectName(this.project.id, this.editableTitle.trim());
      this.project.name = this.editableTitle.trim();
      this.editingTitle = false;
    }
  }

  // adjust modal state
  showAdjust = false;
  adjustTitle = '';
  adjustLabel = '';
  adjustMin = 0;
  adjustMax = 100;
  adjustStep = 1;
  adjustSuffix = '';
  adjustValue = 0;
  adjustApply: (() => void) | null = null;

  openAdjustForDefer(task: ProjectTask) {
    this.adjustTitle = 'Defer Task';
    this.adjustLabel = 'Days from today';
    // compute current offset
    const today = new Date(); today.setHours(0,0,0,0);
    const curr = task.dueDate ? Math.round((new Date(task.dueDate).getTime() - today.getTime()) / (1000*60*60*24)) : 0;
    this.adjustMin = -30; this.adjustMax = 365; this.adjustStep = 1; this.adjustSuffix=' d';
    this.adjustValue = curr;
    this.adjustApply = () => {
      const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() + this.adjustValue);
      task.dueDate = d.toISOString();
    };
    this.showAdjust = true;
  }

  openAdjustForPlanned(task: ProjectTask) {
    this.adjustTitle = 'Planned Pomodoros';
    this.adjustLabel = '25-minute blocks';
    this.adjustMin = 0; this.adjustMax = 100; this.adjustStep = 1; this.adjustSuffix='';
    this.adjustValue = task.pomodorosPlanned || 0;
    this.adjustApply = () => { task.pomodorosPlanned = this.adjustValue; };
    this.showAdjust = true;
  }

  openAdjustForDone(task: ProjectTask) {
    this.adjustTitle = 'Completed Pomodoros';
    this.adjustLabel = '25-minute blocks';
    this.adjustMin = 0; this.adjustMax = 100; this.adjustStep = 1; this.adjustSuffix='';
    this.adjustValue = task.pomodorosDone || 0;
    this.adjustApply = () => { task.pomodorosDone = this.adjustValue; };
    this.showAdjust = true;
  }

  closeAdjust() { this.showAdjust = false; this.adjustApply = null; }
  saveAdjust(val: number) { this.adjustValue = val; if (this.adjustApply) this.adjustApply(); this.closeAdjust(); }

  // view/edit task modal
  taskModalOpen = false;
  taskModel: TaskEditModel = { title: '' };
  taskModelTarget: ProjectTask | null = null;

  openTaskModal(task: ProjectTask) {
    this.taskModelTarget = task;
    this.taskModel = {
      title: task.title,
      description: task.description,
      context: task.context,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.substring(0,10) : '',
      priority: task.priority,
      pomodorosPlanned: task.pomodorosPlanned || 0,
      pomodorosDone: task.pomodorosDone || 0,
    };
    this.taskModalOpen = true;
  }

  closeTaskModal() { this.taskModalOpen = false; this.taskModelTarget = null; }
  saveTaskModal(model: TaskEditModel) {
    if (!this.taskModelTarget) return;
    const t = this.taskModelTarget;
    t.title = model.title;
    t.description = model.description;
    t.context = model.context;
    t.status = model.status ? model.status : undefined;
    t.priority = model.priority;
    t.dueDate = model.dueDate ? new Date(model.dueDate).toISOString() : undefined;
    t.pomodorosPlanned = model.pomodorosPlanned || 0;
    t.pomodorosDone = model.pomodorosDone || 0;
    this.closeTaskModal();
  }
}
