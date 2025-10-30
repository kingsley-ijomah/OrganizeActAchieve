import { Routes } from '@angular/router';
import { InboxComponent } from './inbox/inbox.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/inbox',
    pathMatch: 'full'
  },
  {
    path: 'inbox',
    component: InboxComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'projects/:id',
    component: ProjectDetailsComponent
  }
];
