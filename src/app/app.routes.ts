import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminTables } from './pages/admin-tables/admin-tables';
import { Login } from './pages/login/login';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  { path: '', component: Home, title: 'Serv.io | Smarter restaurant management' },
  { path: 'login', component: Login, title: 'Admin Login | Serv.io' },
  {
    path: 'admin/orders',
    loadComponent: () =>
      import('./pages/admin-orders/admin-orders').then((module) => module.AdminOrders),
    canActivate: [adminGuard],
    title: 'Orders | Serv.io Admin',
  },
  {
    path: 'admin/services',
    loadComponent: () =>
      import('./pages/admin-services/admin-services').then((module) => module.AdminServices),
    canActivate: [adminGuard],
    title: 'Services | Serv.io Admin',
  },
  {
    path: 'admin/staff',
    loadComponent: () =>
      import('./pages/admin-staff/admin-staff').then((module) => module.AdminStaff),
    canActivate: [adminGuard],
    title: 'Staff | Serv.io Admin',
  },
  {
    path: 'admin/customers',
    loadComponent: () =>
      import('./pages/admin-customers/admin-customers').then((module) => module.AdminCustomers),
    canActivate: [adminGuard],
    title: 'Customers | Serv.io Admin',
  },
  {
    path: 'admin/reports',
    loadComponent: () =>
      import('./pages/admin-reports/admin-reports').then((module) => module.AdminReports),
    canActivate: [adminGuard],
    title: 'Reports | Serv.io Admin',
  },
  {
    path: 'admin/settings',
    loadComponent: () =>
      import('./pages/admin-settings/admin-settings').then((module) => module.AdminSettings),
    canActivate: [adminGuard],
    title: 'Settings | Serv.io Admin',
  },
  {
    path: 'admin/tables',
    component: AdminTables,
    canActivate: [adminGuard],
    title: 'Tables | Serv.io Admin',
  },
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [adminGuard],
    title: 'Admin Dashboard | Serv.io',
  },
  { path: '**', redirectTo: '' },
];
