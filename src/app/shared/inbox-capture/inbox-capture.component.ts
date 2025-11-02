import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inbox-capture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inbox-capture.component.html',
  styleUrls: ['./inbox-capture.component.scss']
})
export class InboxCaptureComponent implements AfterViewChecked, OnChanges {
  @Input() isVisible: boolean = false;
  @Output() add = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  @ViewChild('textareaRef', { static: false }) textareaRef!: ElementRef<HTMLTextAreaElement>;
  text: string = '';
  shouldFocus = false;

  ngAfterViewChecked() {
    if (this.isVisible && this.shouldFocus && this.textareaRef) {
      this.textareaRef.nativeElement.focus();
      this.shouldFocus = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && this.isVisible) {
      this.shouldFocus = true;
    }
  }

  onEnterKey(event: Event) {
    // Submit on Enter (with or without modifier), create new line on Shift+Enter
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.onAdd();
    }
    // If Shift+Enter, allow default behavior (new line)
  }

  onAdd() {
    if (this.text.trim()) {
      this.add.emit(this.text.trim());
      this.text = '';
      this.close.emit();
    }
  }

  onClose() {
    this.text = '';
    this.close.emit();
  }
}

