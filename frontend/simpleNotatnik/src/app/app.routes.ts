import { Routes } from '@angular/router';
import { NotesPage } from './notes-page.component';
import { MediaPage } from './media-page.component';
import { WelcomePage } from './welcome-page.component';
import { authGuard } from './auth.guard'; // <--- Importujemy naszego strażnika

export const routes: Routes = [
  {
    path: '', 
    component: WelcomePage, // <--- Dostępne dla każdego (publiczne)
    pathMatch: 'full' 
  },
  {
    path: 'notes',
    component: NotesPage,
    canActivate: [authGuard] // <--- BRAMKARZ: "Pokaż dowód, inaczej wypad na Welcome"
  },
  {
    path: 'media',
    component: MediaPage,
    canActivate: [authGuard] // <--- BRAMKARZ: Tu też chronimy wstęp
  },
  // Fallback
  { path: '**', redirectTo: '' }, 
];