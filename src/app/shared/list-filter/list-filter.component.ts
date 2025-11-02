import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
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
export class ListFilterComponent implements OnChanges {
  @Input() value: ListFilterValue = 'all';
  @Input() isOpen: boolean = false;
  @Output() change = new EventEmitter<ListFilterValue>();
  @Output() close = new EventEmitter<void>();

  localValue: ListFilterValue = 'all';

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


