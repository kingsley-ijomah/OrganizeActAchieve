import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, InboxItem, Project } from '../services/data.service';
import { TaskItemComponent } from '../shared/task-item/task-item.component';
import { ProjectSelectorComponent } from '../shared/project-selector/project-selector.component';
import { LoadMoreButtonComponent } from '../shared/load-more-button/load-more-button.component';
import { ConvertOrAddModalComponent } from '../shared/convert-or-add-modal/convert-or-add-modal.component';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { TaskDetailsModalComponent, TaskDetails } from '../shared/task-details-modal/task-details-modal.component';
import { ListFilterComponent, ListFilterValue } from '../shared/list-filter/list-filter.component';
import { InboxCaptureComponent } from '../shared/inbox-capture/inbox-capture.component';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TaskItemComponent,
    ProjectSelectorComponent,
    LoadMoreButtonComponent,
    ConvertOrAddModalComponent,
    TaskDetailsModalComponent,
    ConfirmModalComponent,
    ListFilterComponent,
    InboxCaptureComponent
  ],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent {
  showCapture = false;
  showFilter = false;
  itemsPerPage = 10;
  displayedItemsCount = 10;
  editingItemId: number | null = null;
  
  // Project selector state
  showProjectSelector = false;
  showConvertOrAdd = false;
  showTaskDetails = false;
  showConfirmDone = false;
  showConfirmDelete = false;
  selectedItem: InboxItem | null = null;
  pendingDetails: TaskDetails | null = null;
  pendingCompleteId: number | null = null;
  pendingDeleteId: number | null = null;
  
  inboxItems: InboxItem[] = [];
  projects: Project[] = [];
  filter: ListFilterValue = 'all';

  constructor(private dataService: DataService) {
    this.inboxItems = this.dataService.getInboxItems();
    this.projects = this.dataService.getProjects();
  }

  private isToday(dateIso?: string): boolean {
    if (!dateIso) return true;
    const d = new Date(dateIso);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }

  private isThisWeek(dateIso?: string): boolean {
    if (!dateIso) return true;
    const d = new Date(dateIso);
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return d >= monday && d <= sunday;
  }

  get filteredItems() {
    if (this.filter === 'today') {
      return this.inboxItems.filter(i => this.isToday(i.createdAt));
    }
    if (this.filter === 'week') {
      return this.inboxItems.filter(i => this.isThisWeek(i.createdAt));
    }
    return this.inboxItems;
  }

  get displayedItems() {
    return this.filteredItems.slice(0, this.displayedItemsCount);
  }

  get hasMoreItems() {
    return this.displayedItemsCount < this.filteredItems.length;
  }

  get remainingCount() {
    return this.filteredItems.length - this.displayedItemsCount;
  }


  loadMore() {
    this.displayedItemsCount = Math.min(
      this.displayedItemsCount + this.itemsPerPage,
      this.filteredItems.length
    );
  }

  openFilter() {
    this.showFilter = true;
  }

  closeFilter() {
    this.showFilter = false;
  }

  onFilterChange(val: ListFilterValue) {
    this.filter = val;
    this.displayedItemsCount = Math.min(this.itemsPerPage, this.filteredItems.length);
    this.closeFilter();
  }

  openCapture() {
    this.showCapture = true;
  }

  closeCapture() {
    this.showCapture = false;
  }

  addItem(text: string) {
    if (!text.trim()) return;
    const newId = Math.max(...this.inboxItems.map(i => i.id), 0) + 1;
    const newItem: InboxItem = {
      id: newId,
      title: text.trim(),
      createdAt: new Date().toISOString()
    };
    this.dataService.addInboxItem(newItem);
    this.inboxItems = this.dataService.getInboxItems();
    this.closeCapture();
  }

  startEdit(item: InboxItem) {
    this.editingItemId = item.id;
  }

  saveEdit(payload: { id: number; title: string }) {
    const item = this.inboxItems.find(i => i.id === payload.id);
    if (item) {
      item.title = payload.title;
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingItemId = null;
  }

  deleteItem(itemId: number) {
    this.pendingDeleteId = itemId;
    this.showConfirmDelete = true;
  }

  cancelDelete() {
    this.showConfirmDelete = false;
    this.pendingDeleteId = null;
  }

  confirmDelete() {
    if (this.pendingDeleteId == null) return;
    const itemId = this.pendingDeleteId;
    const index = this.inboxItems.findIndex(i => i.id === itemId);
    if (index > -1) {
      this.inboxItems.splice(index, 1);
      this.dataService.removeInboxItem(itemId);
      if (this.editingItemId === itemId) {
        this.cancelEdit();
      }
    }
    this.showConfirmDelete = false;
    this.pendingDeleteId = null;
  }

  completeItem(itemId: number) {
    this.pendingCompleteId = itemId;
    this.showConfirmDone = true;
  }

  cancelComplete() {
    this.showConfirmDone = false;
    this.pendingCompleteId = null;
  }

  confirmComplete() {
    if (this.pendingCompleteId == null) return;
    const itemId = this.pendingCompleteId;
    const index = this.inboxItems.findIndex(i => i.id === itemId);
    if (index > -1) {
      this.inboxItems.splice(index, 1);
      this.dataService.removeInboxItem(itemId);
      if (this.editingItemId === itemId) {
        this.cancelEdit();
      }
    }
    this.showConfirmDone = false;
    this.pendingCompleteId = null;
  }

  isEditing(itemId: number): boolean {
    return this.editingItemId === itemId;
  }

  openProjectSelector(item: InboxItem) {
    if (this.isEditing(item.id)) { return; }
    this.selectedItem = item;
    this.showConvertOrAdd = true;
  }

  closeProjectSelector() {
    this.showProjectSelector = false;
    this.selectedItem = null;
  }

  closeConvertOrAdd() {
    this.showConvertOrAdd = false;
    // keep selectedItem to allow follow-up action
  }

  handleConvertToProject() {
    if (!this.selectedItem) return;
    const newId = Math.max(...this.projects.map(p => p.id), 0) + 1;
    this.dataService.addProject({
      id: newId,
      name: this.selectedItem.title,
      totalTasks: 0,
      completedTasks: 0
    });
    // remove from inbox
    const idx = this.inboxItems.findIndex(i => i.id === this.selectedItem!.id);
    if (idx > -1) {
      this.inboxItems.splice(idx, 1);
      this.dataService.removeInboxItem(this.selectedItem.id);
    }
    this.projects = this.dataService.getProjects();
    this.showConvertOrAdd = false;
    this.selectedItem = null;
  }

  handleAddToProject() {
    this.showConvertOrAdd = false;
    this.showTaskDetails = true;
  }

  closeTaskDetails() {
    this.showTaskDetails = false;
    this.pendingDetails = null;
  }

  saveTaskDetails(details: TaskDetails) {
    this.pendingDetails = details;
    this.showTaskDetails = false;
    // proceed to project selection after capturing details
    this.showProjectSelector = true;
  }

  selectProject(project: Project) {
    if (this.selectedItem) {
      this.dataService.addTaskToProject(this.selectedItem, project.id);
      const index = this.inboxItems.findIndex(i => i.id === this.selectedItem!.id);
      if (index > -1) {
        this.inboxItems.splice(index, 1);
      }
      this.projects = this.dataService.getProjects();
      this.closeProjectSelector();
    }
  }
}
