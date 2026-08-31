import { Routes } from '@angular/router';
import { Privacy } from './privacy/privacy';
import { Home } from './home/home';
import { AdminShell } from './admin/admin-shell';
import { ContentEditor } from './admin/content-editor/content-editor';
import { SectionsManager } from './admin/sections-manager/sections-manager';
import { AdminLogin } from './admin/admin-login/admin-login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'policies', component: Privacy },
    { path: 'admin/login', component: AdminLogin },
    {
      path: 'admin',
      component: AdminShell,
      canActivate: [authGuard],
      children: [
        { path: '', redirectTo: 'content', pathMatch: 'full' },
        { path: 'content', component: ContentEditor },
        { path: 'sections', component: SectionsManager },
      ],
    },
];
