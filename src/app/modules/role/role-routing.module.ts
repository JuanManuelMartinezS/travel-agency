import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role.component';
import { RolesViewComponent } from './pages/roles-view/roles-view.component';
import { ManageComponent } from './manage/manage.component';
import { RolePermissionComponent } from '../role-permission/role-permission.component';

const routes: Routes = [
  {
    path: '',
    component: RoleComponent,
    children: [
      { path: '', redirectTo: 'table', pathMatch: 'full' },
      { path: 'table', component: RolesViewComponent },
      { path: 'create', component: ManageComponent },
      { path: 'view/:id', component: ManageComponent },
      { path: 'update/:id', component: ManageComponent },
      { path: 'permissions/:id', component: RolePermissionComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
