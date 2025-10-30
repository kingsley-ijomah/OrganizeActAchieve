import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TaskDetails {
  description: string;
  context: 'computer' | 'phone' | 'home' | 'office' | '';
  status: 'not_started' | 'in_progress' | 'completed' | 'deferred' | '';
  dueDate?: string; // ISO date string
  priority: 'normal' | 'high' | 'low' | '';
  pomodoros: number; // number of 25-min blocks
}

@Component({
  selector: 'app-task-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-details-modal.component.html',
  styleUrls: ['./task-details-modal.component.scss']
})
export class TaskDetailsModalComponent {
  @Input() isOpen: boolean = false;
  @Input() taskTitle: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TaskDetails>();

  model: TaskDetails = {
    description: '',
    context: '',
    status: '',
    dueDate: '',
    priority: 'normal',
    pomodoros: 0
  };

  pomodoroOptions: number[] = Array.from({ length: 12 }, (_, i) => (i + 1)); // up to 12 x 25min = 5h

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  onSave() {
    this.save.emit({ ...this.model });
  }
}


