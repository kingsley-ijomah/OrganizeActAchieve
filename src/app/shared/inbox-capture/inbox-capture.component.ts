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

  @ViewChild('inputRef', { static: false }) inputRef!: ElementRef<HTMLInputElement>;
  text: string = '';
  shouldFocus = false;

  ngAfterViewChecked() {
    if (this.isVisible && this.shouldFocus && this.inputRef) {
      this.inputRef.nativeElement.focus();
      this.shouldFocus = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && this.isVisible) {
      this.shouldFocus = true;
    }
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

