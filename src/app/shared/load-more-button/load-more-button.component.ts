import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-load-more-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './load-more-button.component.html',
  styleUrls: ['./load-more-button.component.scss']
})
export class LoadMoreButtonComponent {
  @Input() hasMore: boolean = false;
  @Input() remainingCount: number = 0;
  @Output() loadMore = new EventEmitter<void>();

  onLoadMore() {
    this.loadMore.emit();
  }
}

