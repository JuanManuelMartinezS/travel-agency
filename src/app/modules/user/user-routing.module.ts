import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { TableComponent } from './pages/table/table.component';
import { ManageComponent } from './manage/manage.component';
import { TableUserRoleComponent } from '../user-role/pages/table/table.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'table', pathMatch: 'full' },
      { path: 'table', component: TableComponent },
      {path: 'table/roles/by-user/:userId', component: TableUserRoleComponent, data: { type: 'roles-by-user' } },
      {path: 'table/users/by-role/:roleId', component: TableUserRoleComponent, data: { type: 'users-by-role' } },
      { path: 'create', component: ManageComponent },
      { path: 'view/:id', component: ManageComponent},
      { path: 'update/:id', component: ManageComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
