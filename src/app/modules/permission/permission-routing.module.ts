import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionComponent } from './permission.component';
import { ManageComponent } from './manage/manage.component';
import { PermissionsViewComponent } from './pages/permissions-view/permissions-view.component';

const routes: Routes = [
  {
    path: '',
    component: PermissionComponent,
    children: [
      { path: '', redirectTo: 'table', pathMatch: 'full' },
      { path: 'table', component: PermissionsViewComponent },
      { path: 'create', component: ManageComponent },
      { path: 'view/:id', component: ManageComponent },
      { path: 'update/:id', component: ManageComponent },
      { path: '**', redirectTo: 'errors/404' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule { }
