import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-number-adjust-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './number-adjust-modal.component.html',
  styleUrls: ['./number-adjust-modal.component.scss']
})
export class NumberAdjustModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Adjust';
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() suffix: string = '';

  @Output() save = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  dec() { this.value = Math.max(this.min, this.value - this.step); }
  inc() { this.value = Math.min(this.max, this.value + this.step); }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) this.close.emit();
  }
}


