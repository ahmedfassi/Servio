import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/tables',
    renderMode: RenderMode.Client,
  },
  { path: 'admin/orders', renderMode: RenderMode.Client },
  { path: 'admin/services', renderMode: RenderMode.Client },
  { path: 'admin/staff', renderMode: RenderMode.Client },
  { path: 'admin/customers', renderMode: RenderMode.Client },
  { path: 'admin/reports', renderMode: RenderMode.Client },
  { path: 'admin/settings', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
