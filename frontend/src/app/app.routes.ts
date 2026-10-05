import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },

  // --- Autenticación ---
  {
    path: 'login',
    loadComponent: () => import('./auth/auth-page/auth-page').then((m) => m.AuthPage),
    data: { mode: 'login' },
  },
  {
    path: 'registro',
    loadComponent: () => import('./auth/auth-page/auth-page').then((m) => m.AuthPage),
    data: { mode: 'register' },
  },

  // --- Público (sin sesión) ---
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./catalog/catalog-page/catalog-page').then((m) => m.CatalogPage),
  },
  {
    path: 'plantilla/:id',
    loadComponent: () =>
      import('./catalog/template-detail/template-detail').then((m) => m.TemplateDetail),
  },
  {
    path: 'i/:token',
    loadComponent: () =>
      import('./public/invitation-view/invitation-view').then((m) => m.InvitationView),
  },
  {
    path: 'r/:token',
    loadComponent: () =>
      import('./guests/rsvp-view/rsvp-view').then((m) => m.RsvpViewComponent),
  },

  // --- Protegido (requiere sesión de organizador) ---
  {
    path: 'mis-invitaciones',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./invitations/my-invitations/my-invitations').then((m) => m.MyInvitations),
  },
  {
    path: 'editor/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./invitations/editor/editor').then((m) => m.Editor),
  },
  {
    path: 'vista-previa/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./invitations/preview/preview').then((m) => m.InvitationPreview),
  },
  {
    path: 'pago/exito',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./orders/payment-success/payment-success').then((m) => m.PaymentSuccess),
  },
  {
    path: 'invitacion/:invitationId/invitados',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./guests/guests-panel/guests-panel').then((m) => m.GuestsPanel),
  },
  {
    path: 'admin/plantillas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./admin/admin-templates/admin-templates').then((m) => m.AdminTemplates),
  },
  {
    path: 'admin/pedidos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./admin/admin-orders/admin-orders').then((m) => m.AdminOrders),
  },
  {
    path: 'solicitudes/nueva',
    canActivate: [authGuard],
    loadComponent: () => import('./design/request-form/request-form').then((m) => m.RequestForm),
  },
  {
    path: 'solicitudes',
    canActivate: [authGuard],
    loadComponent: () => import('./design/my-requests/my-requests').then((m) => m.MyRequests),
  },
  {
    path: 'solicitudes/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./design/request-detail/request-detail').then((m) => m.RequestDetail),
  },
  {
    path: 'admin/solicitudes',
    canActivate: [authGuard],
    loadComponent: () => import('./design/admin-design/admin-design').then((m) => m.AdminDesign),
  },
  {
    path: 'validar',
    canActivate: [authGuard],
    loadComponent: () => import('./tickets/validate/validate').then((m) => m.Validate),
  },
  {
    path: 'validar/:token',
    canActivate: [authGuard],
    loadComponent: () => import('./tickets/validate/validate').then((m) => m.Validate),
  },

  { path: '**', redirectTo: '' },
];
