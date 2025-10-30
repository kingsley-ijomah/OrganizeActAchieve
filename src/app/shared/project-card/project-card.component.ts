import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectCardData {
  id: number;
  name: string;
  totalTasks: number;
  completedTasks: number;
}

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {
  @Input() project!: ProjectCardData;
  @Output() delete = new EventEmitter<number>();

  get progress(): number {
    if (!this.project || this.project.totalTasks === 0) return 0;
    return Math.round((this.project.completedTasks / this.project.totalTasks) * 100);
  }

  onDelete() {
    this.delete.emit(this.project.id);
  }
}
