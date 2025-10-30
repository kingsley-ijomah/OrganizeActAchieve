import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-convert-or-add-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convert-or-add-modal.component.html',
  styleUrls: ['./convert-or-add-modal.component.scss']
})
export class ConvertOrAddModalComponent {
  @Input() isOpen: boolean = false;
  @Input() taskTitle: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() convertToProject = new EventEmitter<void>();
  @Output() addToProject = new EventEmitter<void>();

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}


