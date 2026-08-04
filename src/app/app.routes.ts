import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Home } from './pages/home/home';
import { Policies } from './pages/policies/policies';
import { Services } from './pages/services/services';

export const routes: Routes = [
  { path: '', component: Home, title: 'Serv.io | Smarter restaurant management' },
  { path: 'services', component: Services, title: 'Services | Serv.io' },
  { path: 'about', component: About, title: 'About Us | Serv.io' },
  { path: 'policies', component: Policies, title: 'Policies | Serv.io' },
  { path: '**', redirectTo: '' },
];
