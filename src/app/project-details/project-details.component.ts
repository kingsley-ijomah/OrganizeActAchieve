import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProgressStatComponent } from '../shared/progress-stat/progress-stat.component';
import { FormsModule } from '@angular/forms';
import { NumberAdjustModalComponent } from '../shared/number-adjust-modal/number-adjust-modal.component';
import { TaskEditModalComponent, TaskEditModel } from '../shared/task-edit-modal/task-edit-modal.component';
import { TaskCreateModalComponent, TaskCreateModel } from '../shared/task-create-modal/task-create-modal.component';
import { TaskFilterComponent, TaskFilterValue } from '../shared/task-filter/task-filter.component';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { DraggableListItemDirective } from '../shared/draggable-list-item/draggable-list-item.directive';
import { DataService, Project, ProjectTask } from '../services/data.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProgressStatComponent, NumberAdjustModalComponent, TaskEditModalComponent, TaskCreateModalComponent, TaskFilterComponent, ConfirmModalComponent, DraggableListItemDirective],
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

  // Selection state
  selectedTaskIds = new Set<number>();
  showConfirmComplete = false;

  // Derived sections
  filter: TaskFilterValue = 'all';
  showFilter = false;
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

  getArray(count: number): number[] {
    return Array.from({ length: Math.max(0, count) }, (_, i) => i);
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

  get hasSelectedTasks(): boolean {
    return this.selectedTaskIds.size > 0;
  }

  get selectedCount(): number {
    return this.selectedTaskIds.size;
  }

  isSelected(taskId: number): boolean {
    return this.selectedTaskIds.has(taskId);
  }

  toggleSelect(taskId: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (this.selectedTaskIds.has(taskId)) {
      this.selectedTaskIds.delete(taskId);
    } else {
      this.selectedTaskIds.add(taskId);
    }
  }

  clearSelection() {
    this.selectedTaskIds.clear();
  }

  markSelectedAsComplete() {
    if (this.selectedTaskIds.size === 0) return;
    this.showConfirmComplete = true;
  }

  cancelComplete() {
    this.showConfirmComplete = false;
  }

  confirmComplete() {
    this.selectedTaskIds.forEach(taskId => {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = 'completed';
      }
    });
    // Update project completed tasks count
    if (this.project) {
      this.project.completedTasks = this.tasks.filter(t => t.status === 'completed').length;
    }
    this.selectedTaskIds.clear();
    this.showConfirmComplete = false;
  }

  deferTask(task: ProjectTask, days: number) {
    const base = task.dueDate ? new Date(task.dueDate) : new Date();
    base.setDate(base.getDate() + days);
    task.dueDate = base.toISOString();
    if (task.status === 'completed') task.status = 'not_started';
  }

  incPomodoro(task: ProjectTask) { task.pomodorosPlanned = Math.min(4, (task.pomodorosPlanned || 0) + 1); }
  decPomodoro(task: ProjectTask) { task.pomodorosPlanned = Math.max(0, (task.pomodorosPlanned || 0) - 1); }
  incPomodoroDone(task: ProjectTask) { task.pomodorosDone = Math.min(4, (task.pomodorosDone || 0) + 1); }

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
    this.adjustMin = 0; this.adjustMax = 4; this.adjustStep = 1; this.adjustSuffix='';
    this.adjustValue = Math.min(4, task.pomodorosPlanned || 0);
    this.adjustApply = () => { task.pomodorosPlanned = Math.min(4, Math.max(0, this.adjustValue)); };
    this.showAdjust = true;
  }

  openAdjustForDone(task: ProjectTask) {
    this.adjustTitle = 'Completed Pomodoros';
    this.adjustLabel = '25-minute blocks';
    this.adjustMin = 0; this.adjustMax = 4; this.adjustStep = 1; this.adjustSuffix='';
    this.adjustValue = Math.min(4, task.pomodorosDone || 0);
    this.adjustApply = () => { task.pomodorosDone = Math.min(4, Math.max(0, this.adjustValue)); };
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
    t.pomodorosPlanned = model.pomodorosPlanned != null ? Math.min(4, Math.max(0, model.pomodorosPlanned)) : 0;
    t.pomodorosDone = model.pomodorosDone != null ? Math.min(4, Math.max(0, model.pomodorosDone)) : 0;
    this.closeTaskModal();
  }

  // create task modal
  createModalOpen = false;
  createModel: TaskCreateModel = { title: '', status: 'not_started', priority: 'normal' };
  
  openCreateModal() {
    this.createModel = { title: '', status: 'not_started', priority: 'normal' };
    this.createModalOpen = true;
  }

  closeCreateModal() { this.createModalOpen = false; }
  
  saveCreateModal(model: TaskCreateModel) {
    if (!this.project || !model.title.trim()) return;
    const newTask: Omit<ProjectTask, 'id' | 'projectId'> = {
      title: model.title.trim(),
      description: model.description,
      context: model.context,
      status: model.status || 'not_started',
      priority: model.priority,
      dueDate: model.dueDate ? new Date(model.dueDate).toISOString() : undefined,
      pomodorosPlanned: model.pomodorosPlanned != null ? Math.min(4, Math.max(0, model.pomodorosPlanned)) : 0,
      pomodorosDone: model.pomodorosDone != null ? Math.min(4, Math.max(0, model.pomodorosDone)) : 0,
      createdAt: new Date().toISOString(),
    };
    this.data.addTaskToProjectWithDetails(this.project.id, newTask);
    this.tasks = this.data.getProjectTasks(this.project.id);
    // update project counts
    if (this.project) {
      this.project.totalTasks = (this.project.totalTasks || 0) + 1;
    }
    this.closeCreateModal();
  }

  openFilter() {
    this.showFilter = true;
  }

  closeFilter() {
    this.showFilter = false;
  }

  onFilterChange(val: TaskFilterValue) {
    this.filter = val;
    this.closeFilter();
  }

  getStatusLabel(status?: string): string {
    if (!status) return '';
    const statusMap: Record<string, string> = {
      'not_started': 'Not Started',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'deferred': 'Deferred'
    };
    return statusMap[status] || status;
  }

  // Drag and drop handlers
  draggedTaskId: number | null = null;

  onDragStart(event: { itemId: any; index: number }) {
    this.draggedTaskId = event.itemId;
  }

  onDragEnd() {
    this.draggedTaskId = null;
  }

  onDragOver(index: number) {
    // Visual feedback is handled by the directive
  }

  onDragLeave() {
    // Visual feedback is handled by the directive
  }

  onDrop(dropIndex: number) {
    if (!this.draggedTaskId || !this.project) return;
    
    const tasks = [...this.filteredTasks]; // Create a copy to manipulate
    const draggedTask = tasks.find(t => t.id === this.draggedTaskId);
    if (!draggedTask) return;

    // Find current position
    const currentIndex = tasks.findIndex(t => t.id === this.draggedTaskId);
    if (currentIndex === dropIndex) {
      return; // No change needed
    }

    // Remove from old position and insert at new position
    tasks.splice(currentIndex, 1);
    tasks.splice(dropIndex, 0, draggedTask);
    
    // Recalculate all orders to be sequential integers (0, 1, 2, ...)
    // Note: We need to update orders for all tasks in the project, not just filtered ones
    // So we'll update the full tasks array
    const allTasks = this.data.getProjectTasks(this.project.id);
    
    // Get the filtered task IDs in their new order
    const reorderedTaskIds = tasks.map(t => t.id);
    
    // For filtered tasks, update their order based on new position
    // For non-filtered tasks, keep their existing order relative to each other
    let newOrderIndex = 0;
    reorderedTaskIds.forEach((taskId, idx) => {
      const task = allTasks.find(t => t.id === taskId);
      if (task) {
        task.order = newOrderIndex;
        newOrderIndex++;
      }
    });
    
    // Update all task orders in the data service
    const taskOrders = allTasks.map(task => ({ id: task.id, order: task.order || 0 }));
    this.data.updateTaskOrders(this.project.id, taskOrders);
    
    // Refresh the tasks list
    this.tasks = this.data.getProjectTasks(this.project.id);
    
    this.draggedTaskId = null;
  }
}
