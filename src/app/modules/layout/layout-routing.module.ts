import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: LayoutComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'components',
    component: LayoutComponent,
    loadChildren: () => import('../uikit/uikit.module').then((m) => m.UikitModule),
  },
  {
    path: 'users',
    component: LayoutComponent,
    loadChildren: () => import('../user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'roles',
    component: LayoutComponent,
    loadChildren: () => import('../role/role.module').then((m) => m.RoleModule),
  },
  {
    path: 'permissions',
    component: LayoutComponent,
    loadChildren: () => import('../permission/permission.module').then((m) => m.PermissionModule),
  },
  {
    path: 'role-permissions',
    component: LayoutComponent,
    loadChildren: () => import('../role-permission/role-permission.module').then((m) => m.RolePermissionModule),
  },
  {
    path: 'user-roles', // Ruta separada para user-roles
    component: LayoutComponent,
    loadChildren: () => import('../user-role/user-role.module').then((m) => m.UserRoleModule),
  },
  {
    path: 'sessions',
    component: LayoutComponent,
    loadChildren: () => import('../session/session.module').then((m) => m.SessionModule),
  },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
