import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  activeRoute: string = '';

  navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/inbox', label: 'Inbox', icon: 'inbox' },
    { path: '/projects', label: 'Projects', icon: 'folder' },
    { path: '/calendar', label: 'Calendar', icon: 'calendar_today' }
  ];

  constructor(private router: Router) {
    // Get current route on navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
      });

    // Set initial route
    this.activeRoute = this.router.url;
  }

  isActive(path: string): boolean {
    return this.activeRoute === path || this.activeRoute.startsWith(path + '/');
  }
}

