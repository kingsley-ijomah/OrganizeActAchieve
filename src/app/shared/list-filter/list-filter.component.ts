import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type ListFilterValue = 'all' | 'today' | 'week';

@Component({
  selector: 'app-list-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.scss']
})
export class ListFilterComponent {
  @Input() value: ListFilterValue = 'all';
  @Output() change = new EventEmitter<ListFilterValue>();

  isOpen = false;
  localValue: ListFilterValue = 'all';

  open() {
    this.localValue = this.value;
    this.isOpen = true;
  }

  close() { this.isOpen = false; }

  apply() {
    this.change.emit(this.localValue);
    this.isOpen = false;
  }
}


