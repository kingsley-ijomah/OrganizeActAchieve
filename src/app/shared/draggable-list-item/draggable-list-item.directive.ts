import { Directive, Input, Output, EventEmitter, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDraggableListItem]',
  standalone: true
})
export class DraggableListItemDirective {
  @Input() itemId: any; // The unique identifier for this item
  @Input() itemIndex: number = 0; // The index in the list
  @Input() isDisabled: boolean = false; // Whether dragging is disabled
  @Output() dragStart = new EventEmitter<{ itemId: any; index: number }>();
  @Output() dragEnd = new EventEmitter<void>();
  @Output() dragOver = new EventEmitter<number>();
  @Output() dragLeave = new EventEmitter<void>();
  @Output() drop = new EventEmitter<number>(); // Emits the drop index

  @HostBinding('draggable')
  get draggable(): boolean {
    return !this.isDisabled;
  }

  @HostBinding('class.dragging')
  isDragging: boolean = false;

  @HostBinding('class.drag-over')
  isDragOver: boolean = false;

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent): void {
    if (this.isDisabled || !event.dataTransfer) return;
    
    this.isDragging = true;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(this.itemId));
    
    if (event.target instanceof HTMLElement) {
      event.target.style.opacity = '0.5';
    }
    
    this.dragStart.emit({ itemId: this.itemId, index: this.itemIndex });
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent): void {
    this.isDragging = false;
    this.isDragOver = false;
    
    if (event.target instanceof HTMLElement) {
      event.target.style.opacity = '1';
    }
    
    this.dragEnd.emit();
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!event.dataTransfer) return;
    
    event.dataTransfer.dropEffect = 'move';
    this.isDragOver = true;
    this.dragOver.emit(this.itemIndex);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    // Only clear dragOver if we're leaving the element itself
    if (event.target instanceof HTMLElement && event.currentTarget instanceof HTMLElement) {
      if (!event.currentTarget.contains(event.relatedTarget as Node)) {
        this.isDragOver = false;
        this.dragLeave.emit();
      }
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    this.drop.emit(this.itemIndex);
  }

  // Public method to reset state (useful for external control)
  resetState(): void {
    this.isDragging = false;
    this.isDragOver = false;
  }
}

