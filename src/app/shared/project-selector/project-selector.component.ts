import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InboxItem, Project } from '../../services/data.service';

@Component({
  selector: 'app-project-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent {
  @Input() isOpen: boolean = false;
  @Input() selectedItem: InboxItem | null = null;
  @Input() projects: Project[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() selectProject = new EventEmitter<Project>();

  projectSearchQuery: string = '';

  get filteredProjects(): Project[] {
    if (!this.projectSearchQuery.trim()) {
      return this.projects;
    }
    const query = this.projectSearchQuery.toLowerCase().trim();
    return this.projects.filter(project => 
      project.name.toLowerCase().includes(query)
    );
  }

  onClose() {
    this.projectSearchQuery = '';
    this.close.emit();
  }

  onSelectProject(project: Project) {
    this.projectSearchQuery = '';
    this.selectProject.emit(project);
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}

