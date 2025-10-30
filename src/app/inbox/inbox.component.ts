import { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, InboxItem, Project } from '../services/data.service';

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
  
  // Project selector state
  showProjectSelector = false;
  selectedItem: InboxItem | null = null;
  projectSearchQuery = '';
  
  inboxItems: InboxItem[] = [];
  projects: Project[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private dataService: DataService
  ) {
    this.inboxItems = this.dataService.getInboxItems();
    this.projects = this.dataService.getProjects();
  }

  get displayedItems() {
    return this.inboxItems.slice(0, this.displayedItemsCount);
  }

  get hasMoreItems() {
    return this.displayedItemsCount < this.inboxItems.length;
  }

  get remainingCount() {
    return this.inboxItems.length - this.displayedItemsCount;
  }

  get filteredProjects() {
    if (!this.projectSearchQuery.trim()) {
      return this.projects;
    }
    const query = this.projectSearchQuery.toLowerCase().trim();
    return this.projects.filter(project => 
      project.name.toLowerCase().includes(query)
    );
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

  startEdit(item: InboxItem, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
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

  deleteItem(itemId: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const index = this.inboxItems.findIndex(i => i.id === itemId);
    if (index > -1) {
      this.inboxItems.splice(index, 1);
      this.dataService.removeInboxItem(itemId);
      // If we're editing this item, cancel edit
      if (this.editingItemId === itemId) {
        this.cancelEdit();
      }
    }
  }

  isEditing(itemId: number): boolean {
    return this.editingItemId === itemId;
  }

  openProjectSelector(item: InboxItem, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    // Don't open if editing
    if (this.isEditing(item.id)) {
      return;
    }
    this.selectedItem = item;
    this.showProjectSelector = true;
    this.projectSearchQuery = '';
  }

  closeProjectSelector() {
    this.showProjectSelector = false;
    this.selectedItem = null;
    this.projectSearchQuery = '';
  }

  selectProject(project: Project) {
    if (this.selectedItem) {
      this.dataService.addTaskToProject(this.selectedItem, project.id);
      // Remove from local inbox list
      const index = this.inboxItems.findIndex(i => i.id === this.selectedItem!.id);
      if (index > -1) {
        this.inboxItems.splice(index, 1);
      }
      // Refresh projects list
      this.projects = this.dataService.getProjects();
      this.closeProjectSelector();
    }
  }
}
