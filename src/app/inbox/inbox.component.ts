import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, InboxItem, Project } from '../services/data.service';
import { TaskItemComponent } from '../shared/task-item/task-item.component';
import { ProjectSelectorComponent } from '../shared/project-selector/project-selector.component';
import { LoadMoreButtonComponent } from '../shared/load-more-button/load-more-button.component';
import { ConvertOrAddModalComponent } from '../shared/convert-or-add-modal/convert-or-add-modal.component';

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
    ConvertOrAddModalComponent
  ],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent {
  showList = false;
  newItemText = '';
  itemsPerPage = 10;
  displayedItemsCount = 10;
  editingItemId: number | null = null;
  
  // Project selector state
  showProjectSelector = false;
  showConvertOrAdd = false;
  selectedItem: InboxItem | null = null;
  
  inboxItems: InboxItem[] = [];
  projects: Project[] = [];

  constructor(private dataService: DataService) {
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

  toggleList() {
    this.showList = !this.showList;
  }

  loadMore() {
    this.displayedItemsCount = Math.min(
      this.displayedItemsCount + this.itemsPerPage,
      this.inboxItems.length
    );
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
    const index = this.inboxItems.findIndex(i => i.id === itemId);
    if (index > -1) {
      this.inboxItems.splice(index, 1);
      this.dataService.removeInboxItem(itemId);
      if (this.editingItemId === itemId) {
        this.cancelEdit();
      }
    }
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
