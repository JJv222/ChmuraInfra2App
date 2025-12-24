import { Routes } from '@angular/router';
import { NotesPage } from './notes-page.component';
import { MediaPage } from './media-page.component';

export const routes: Routes = [
  {
    path: 'notes',
    component: NotesPage,
  },
  {
    path: 'media',
    component: MediaPage,
  },
  { path: '', pathMatch: 'full', redirectTo: 'notes' },
  { path: '**', redirectTo: 'notes' },
];
