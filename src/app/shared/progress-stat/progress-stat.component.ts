import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-stat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-stat.component.html',
  styleUrls: ['./progress-stat.component.scss']
})
export class ProgressStatComponent {
  @Input() label: string = 'Progress';
  @Input() completed: number = 0;
  @Input() total: number = 0;

  get percent(): number {
    if (!this.total) return 0;
    return Math.round((this.completed / this.total) * 100);
  }
}


