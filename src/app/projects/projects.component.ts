import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Project {
  id: number;
  name: string;
  totalTasks: number;
  completedTasks: number;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  searchQuery: string = '';
  newProjectName: string = '';
  showAddForm: boolean = false;
  itemsPerPage: number = 8;
  displayedItemsCount: number = 8;
  
  projects: Project[] = [
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
      this.projects.unshift({
        id: newId,
        name: this.newProjectName.trim(),
        totalTasks: 0,
        completedTasks: 0
      });
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
    const index = this.projects.findIndex(p => p.id === projectId);
    if (index > -1) {
      this.projects.splice(index, 1);
    }
  }
}
