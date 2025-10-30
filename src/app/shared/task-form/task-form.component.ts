import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TaskFormModel {
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
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  @Input() model!: TaskFormModel;
}

