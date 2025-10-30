import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InboxItem } from '../../services/data.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements AfterViewChecked {
  @Input() item!: InboxItem;
  @Input() isEditing: boolean = false;
  @Output() edit = new EventEmitter<InboxItem>();
  @Output() delete = new EventEmitter<number>();
  @Output() save = new EventEmitter<{ id: number; title: string }>();
  @Output() cancel = new EventEmitter<void>();
  @Output() select = new EventEmitter<InboxItem>();

  @ViewChild('editInput', { static: false }) editInputRef!: ElementRef<HTMLInputElement>;
  editingText: string = '';
  shouldFocus = false;

  ngAfterViewChecked() {
    if (this.isEditing && this.shouldFocus && this.editInputRef) {
      this.editInputRef.nativeElement.focus();
      this.editInputRef.nativeElement.select();
      this.shouldFocus = false;
    }
  }

  onEdit(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.editingText = this.item.title;
    this.shouldFocus = true;
    this.edit.emit(this.item);
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.item.id);
  }

  onSave() {
    if (this.editingText.trim()) {
      this.save.emit({ id: this.item.id, title: this.editingText.trim() });
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingText = '';
    this.cancel.emit();
  }

  onSelect(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (!this.isEditing) {
      this.select.emit(this.item);
    }
  }
}

