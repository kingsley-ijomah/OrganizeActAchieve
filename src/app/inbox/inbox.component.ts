import { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements AfterViewChecked {
  showList = false;
  newItemText = '';
  itemsPerPage = 10;
  displayedItemsCount = 10;
  editingItemId: number | null = null;
  editingItemText = '';
  shouldFocusEdit = false;
  
  inboxItems = [
    { id: 1, title: 'Review project proposal' },
    { id: 2, title: 'Email client for feedback' },
    { id: 3, title: 'Plan weekly review' },
    { id: 4, title: 'Organize workspace' },
    { id: 5, title: 'Schedule team meeting' },
    { id: 6, title: 'Update project documentation' },
    { id: 7, title: 'Follow up on pending invoices' },
    { id: 8, title: 'Research new design trends' },
    { id: 9, title: 'Prepare presentation slides' },
    { id: 10, title: 'Review code changes' },
    { id: 11, title: 'Book flight tickets' },
    { id: 12, title: 'Call dentist for appointment' },
    { id: 13, title: 'Buy groceries for the week' },
    { id: 14, title: 'Finish reading book chapter' },
    { id: 15, title: 'Update personal website' },
    { id: 16, title: 'Organize email inbox' },
    { id: 17, title: 'Plan weekend activities' },
    { id: 18, title: 'Review monthly expenses' },
    { id: 19, title: 'Learn new programming language' },
    { id: 20, title: 'Schedule car maintenance' },
    { id: 21, title: 'Write blog post about productivity' },
    { id: 22, title: 'Set up new development environment' },
    { id: 23, title: 'Update resume' },
    { id: 24, title: 'Create project timeline' },
    { id: 25, title: 'Contact potential collaborators' },
    { id: 26, title: 'Review and respond to messages' },
    { id: 27, title: 'Organize digital files' },
    { id: 28, title: 'Plan exercise routine' },
    { id: 29, title: 'Research investment options' },
    { id: 30, title: 'Update software licenses' },
    { id: 31, title: 'Clean up browser bookmarks' },
    { id: 32, title: 'Schedule doctor appointment' },
    { id: 33, title: 'Review subscription services' },
    { id: 34, title: 'Backup important files' },
    { id: 35, title: 'Plan birthday party' },
  ];

  get displayedItems() {
    return this.inboxItems.slice(0, this.displayedItemsCount);
  }

  get hasMoreItems() {
    return this.displayedItemsCount < this.inboxItems.length;
  }

  get remainingCount() {
    return this.inboxItems.length - this.displayedItemsCount;
  }

  toggleList() {
    this.showList = !this.showList;
  }

  loadMore() {
    this.displayedItemsCount = Math.min(
      this.displayedItemsCount + this.itemsPerPage,
      this.inboxItems.length
    );
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewChecked() {
    if (this.shouldFocusEdit) {
      const editInput = document.querySelector('.edit-input') as HTMLInputElement;
      if (editInput) {
        editInput.focus();
        editInput.select();
        this.shouldFocusEdit = false;
      }
    }
  }

  startEdit(item: { id: number; title: string }) {
    this.editingItemId = item.id;
    this.editingItemText = item.title;
    this.shouldFocusEdit = true;
    this.cdr.detectChanges();
  }

  saveEdit() {
    if (this.editingItemId && this.editingItemText.trim()) {
      const item = this.inboxItems.find(i => i.id === this.editingItemId);
      if (item) {
        item.title = this.editingItemText.trim();
      }
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingItemId = null;
    this.editingItemText = '';
  }

  deleteItem(itemId: number) {
    const index = this.inboxItems.findIndex(i => i.id === itemId);
    if (index > -1) {
      this.inboxItems.splice(index, 1);
      // If we're editing this item, cancel edit
      if (this.editingItemId === itemId) {
        this.cancelEdit();
      }
    }
  }

  isEditing(itemId: number): boolean {
    return this.editingItemId === itemId;
  }
}
