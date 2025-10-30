import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TaskEditModel {
  title: string;
  description?: string;
  context?: 'computer' | 'phone' | 'home' | 'office' | '';
  status?: 'not_started' | 'in_progress' | 'completed' | 'deferred' | '';
  dueDate?: string;
  priority?: 'high' | 'normal' | 'low' | '';
  pomodorosPlanned?: number;
  pomodorosDone?: number;
}

@Component({
  selector: 'app-task-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-edit-modal.component.html',
  styleUrls: ['./task-edit-modal.component.scss']
})
export class TaskEditModalComponent {
  @Input() isOpen: boolean = false;
  @Input() model: TaskEditModel = { title: '' };
  @Output() save = new EventEmitter<TaskEditModel>();
  @Output() close = new EventEmitter<void>();

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) this.close.emit();
  }
}


