import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent {
  showList = false;
  
  inboxItems = [
    { id: 1, title: 'Review project proposal' },
    { id: 2, title: 'Email client for feedback' },
    { id: 3, title: 'Plan weekly review' },
    { id: 4, title: 'Organize workspace' },
  ];

  toggleList() {
    this.showList = !this.showList;
  }
}
