import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, Project } from '../services/data.service';
import { Router } from '@angular/router';
import { LoadMoreButtonComponent } from '../shared/load-more-button/load-more-button.component';
import { ListFilterComponent, ListFilterValue } from '../shared/list-filter/list-filter.component';
import { RouterModule } from '@angular/router';
import { DraggableListItemDirective } from '../shared/draggable-list-item/draggable-list-item.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, RouterModule, LoadMoreButtonComponent, ListFilterComponent, DraggableListItemDirective],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  searchQuery: string = '';
  newProjectName: string = '';
  showAddForm: boolean = false;
  showFilter: boolean = false;
  filter: ListFilterValue = 'all';
  itemsPerPage: number = 8;
  displayedItemsCount: number = 8;
  
  projects: Project[] = [];
  constructor(private dataService: DataService, private router: Router) {
    this.projects = this.dataService.getProjects();
  }


  private mockProjects: Project[] = [
    { id: 1, name: 'Website Redesign', totalTasks: 15, completedTasks: 8 },
    { id: 2, name: 'Mobile App Development', totalTasks: 32, completedTasks: 12 },
    { id: 3, name: 'Marketing Campaign', totalTasks: 24, completedTasks: 18 },
    { id: 4, name: 'Q4 Product Launch', totalTasks: 45, completedTasks: 30 },
    { id: 5, name: 'Customer Research', totalTasks: 12, completedTasks: 7 },
    { id: 6, name: 'Team Training Program', totalTasks: 20, completedTasks: 15 },
    { id: 7, name: 'Infrastructure Upgrade', totalTasks: 28, completedTasks: 10 },
    { id: 8, name: 'Content Strategy', totalTasks: 18, completedTasks: 12 },
    { id: 9, name: 'Brand Identity Refresh', totalTasks: 22, completedTasks: 14 },
    { id: 10, name: 'User Experience Audit', totalTasks: 16, completedTasks: 9 },
    { id: 11, name: 'Analytics Implementation', totalTasks: 14, completedTasks: 6 },
    { id: 12, name: 'Social Media Strategy', totalTasks: 19, completedTasks: 11 },
    { id: 13, name: 'Email Automation', totalTasks: 11, completedTasks: 8 },
    { id: 14, name: 'Customer Onboarding', totalTasks: 26, completedTasks: 17 },
    { id: 15, name: 'Documentation Update', totalTasks: 13, completedTasks: 10 },
    { id: 16, name: 'Security Review', totalTasks: 17, completedTasks: 5 },
    { id: 17, name: 'Performance Optimization', totalTasks: 21, completedTasks: 13 },
    { id: 18, name: 'API Integration', totalTasks: 23, completedTasks: 16 },
    { id: 19, name: 'Database Migration', totalTasks: 29, completedTasks: 20 },
    { id: 20, name: 'Testing Framework', totalTasks: 15, completedTasks: 12 },
  ];

  ngOnInit() {
    // Initialize projects if empty
    if (this.projects.length === 0) {
      this.mockProjects.forEach(project => {
        this.dataService.addProject(project);
      });
      this.projects = this.dataService.getProjects();
    }
  }

  get filteredProjects(): Project[] {
    if (!this.searchQuery.trim()) {
      return this.projects;
    }
    const query = this.searchQuery.toLowerCase().trim();
    return this.projects.filter(project => 
      project.name.toLowerCase().includes(query)
    );
  }

  get displayedProjects(): Project[] {
    return this.filteredProjects.slice(0, this.displayedItemsCount);
  }

  get hasMoreProjects(): boolean {
    return this.displayedItemsCount < this.filteredProjects.length;
  }

  get remainingCount(): number {
    return this.filteredProjects.length - this.displayedItemsCount;
  }

  getProgress(project: Project): number {
    if (project.totalTasks === 0) return 0;
    return Math.round((project.completedTasks / project.totalTasks) * 100);
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.newProjectName = '';
    }
  }

  addProject(): void {
    if (this.newProjectName.trim()) {
      const newId = Math.max(...this.projects.map(p => p.id), 0) + 1;
      const newProject: Project = {
        id: newId,
        name: this.newProjectName.trim(),
        totalTasks: 0,
        completedTasks: 0,
        createdAt: new Date().toISOString()
      };
      this.dataService.addProject(newProject);
      this.projects = this.dataService.getProjects();
      this.newProjectName = '';
      this.showAddForm = false;
    }
  }

  loadMore(): void {
    this.displayedItemsCount = Math.min(
      this.displayedItemsCount + this.itemsPerPage,
      this.filteredProjects.length
    );
  }

  deleteProject(projectId: number): void {
    this.dataService.deleteProject(projectId);
    this.projects = this.dataService.getProjects();
  }

  openDetails(project: Project) {
    this.router.navigate(['/projects', project.id]);
  }

  openFilter(): void {
    this.showFilter = true;
  }

  closeFilter(): void {
    this.showFilter = false;
  }

  onFilterChange(val: ListFilterValue): void {
    this.filter = val;
    this.closeFilter();
    // Reset displayed items count when filter changes
    this.displayedItemsCount = Math.min(this.itemsPerPage, this.filteredProjects.length);
  }

  // Drag and drop handlers
  draggedProjectId: number | null = null;

  onDragStart(event: { itemId: any; index: number }) {
    this.draggedProjectId = event.itemId;
  }

  onDragEnd() {
    this.draggedProjectId = null;
  }

  onDragOver(index: number) {
    // Visual feedback is handled by the directive
  }

  onDragLeave() {
    // Visual feedback is handled by the directive
  }

  onDrop(dropIndex: number) {
    if (!this.draggedProjectId) return;
    
    const projects = [...this.displayedProjects]; // Create a copy to manipulate
    const draggedProject = projects.find(p => p.id === this.draggedProjectId);
    if (!draggedProject) return;

    // Find current position
    const currentIndex = projects.findIndex(p => p.id === this.draggedProjectId);
    if (currentIndex === dropIndex) {
      return; // No change needed
    }

    // Remove from old position and insert at new position
    projects.splice(currentIndex, 1);
    projects.splice(dropIndex, 0, draggedProject);
    
    // Recalculate all orders to be sequential integers (0, 1, 2, ...)
    // Get all projects (not just displayed ones)
    const allProjects = this.dataService.getProjects();
    
    // Get the displayed project IDs in their new order
    const reorderedProjectIds = projects.map(p => p.id);
    
    // Update orders for displayed projects based on new position
    let newOrderIndex = 0;
    reorderedProjectIds.forEach((projectId, idx) => {
      const project = allProjects.find(p => p.id === projectId);
      if (project) {
        project.order = newOrderIndex;
        newOrderIndex++;
      }
    });
    
    // For projects not in displayed list, adjust their orders if needed
    allProjects.forEach(project => {
      if (!reorderedProjectIds.includes(project.id)) {
        if (project.order !== undefined && project.order >= newOrderIndex) {
          // Shift down projects that come after the reordered section
          project.order = (project.order || 0) + projects.length;
        }
      }
    });
    
    // Update all project orders in the data service
    const projectOrders = allProjects.map(project => ({ id: project.id, order: project.order || 0 }));
    this.dataService.updateProjectOrders(projectOrders);
    
    // Refresh the projects list
    this.projects = this.dataService.getProjects();
    
    this.draggedProjectId = null;
  }
}
