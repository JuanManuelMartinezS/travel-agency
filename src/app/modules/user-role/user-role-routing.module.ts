import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user-role.component';

import { TableUserRoleComponent } from './pages/table/table.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },

      //estas rutas no se usan las rutas estan en el modulo de user
      // Usuarios por rol específico
      // { path: 'users/by-role/:roleId', component: TableUserRoleComponent, data: { type: 'users-by-role' } },
      // // Roles de usuario específico
      // { path: 'roles/by-user/:userId', component: TableUserRoleComponent, data: { type: 'roles-by-user' } },
      // // CRUD operations
      // { path: 'create', component: ManageComponent },
      // { path: 'view/:id', component: ManageComponent},
      // { path: 'update/:id', component: ManageComponent },
      // { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoleRoutingModule {}
