// app.routes.ts – ergänze die Home-Route

import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Lernplan } from './lernplan/lernplan';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'mathe',
    component: Lernplan,
    data: { src: '/assets/docs/MatheThemen.md' },
  },
  {
    path: 'physik',
    component: Lernplan,
    data: { src: '/assets/docs/PhysikThemen.md' },
  }
];
