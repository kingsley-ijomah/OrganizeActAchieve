import { Routes } from '@angular/router';
import { InboxComponent } from './inbox/inbox.component';
import { ProjectsComponent } from './projects/projects.component';

export const routes: Routes = [
  {
    path: 'inbox',
    component: InboxComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent
  }
];
