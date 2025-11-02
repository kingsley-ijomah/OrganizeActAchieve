import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type TaskFilterValue = 'all' | 'today' | 'week' | 'no_due' | 'completed';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.scss']
})
export class TaskFilterComponent implements OnChanges {
  @Input() value: TaskFilterValue = 'all';
  @Input() isOpen: boolean = false;
  @Output() change = new EventEmitter<TaskFilterValue>();
  @Output() close = new EventEmitter<void>();

  localValue: TaskFilterValue = 'all';

  ngOnChanges() {
    if (this.isOpen) {
      this.localValue = this.value;
    }
  }

  onClose() {
    this.close.emit();
  }

  apply() {
    this.change.emit(this.localValue);
    this.close.emit();
  }
}

