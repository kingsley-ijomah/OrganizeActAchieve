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
  @Input() isSelected: boolean = false;
  @Output() edit = new EventEmitter<InboxItem>();
  @Output() delete = new EventEmitter<number>();
  @Output() save = new EventEmitter<{ id: number; title: string }>();
  @Output() cancel = new EventEmitter<void>();
  @Output() select = new EventEmitter<InboxItem>();
  @Output() toggleSelect = new EventEmitter<number>();

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

  onToggleSelect(event: Event) {
    event.stopPropagation();
    this.toggleSelect.emit(this.item.id);
  }

  getRelativeTime(dateIso?: string): string {
    if (!dateIso) return '';
    const date = new Date(dateIso);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 14) {
      return '1 week ago';
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 60) {
      return '1 month ago';
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  }

  get displayDate(): string {
    // Use updatedAt if available, otherwise use createdAt
    const dateToUse = this.item.updatedAt || this.item.createdAt;
    const relativeTime = this.getRelativeTime(dateToUse);
    return relativeTime ? `Updated: ${relativeTime}` : '';
  }
}

