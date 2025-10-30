import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFormComponent, TaskFormModel } from '../task-form/task-form.component';

export type TaskCreateModel = TaskFormModel;

@Component({
  selector: 'app-task-create-modal',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './task-create-modal.component.html',
  styleUrls: ['./task-create-modal.component.scss']
})
export class TaskCreateModalComponent {
  @Input() isOpen: boolean = false;
  @Input() model: TaskCreateModel = { title: '', status: 'not_started', priority: 'normal' };
  @Output() save = new EventEmitter<TaskCreateModel>();
  @Output() close = new EventEmitter<void>();

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) this.close.emit();
  }
}

