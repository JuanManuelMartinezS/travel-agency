import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RolePermission } from '../models/role-permission.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  constructor(private http: HttpClient) {}

  // Metodos
  list(): Observable<RolePermission[]> {
    return this.http.get<RolePermission[]>(`${environment.url_ms_security}/role-permission`);
  }

  getByRole(roleId: string): Observable<RolePermission[]> {
    return this.http.get<RolePermission[]>(`${environment.url_ms_security}/role-permission/role/${roleId}`);
  }

  create(roleId: string, permissionId: string): Observable<RolePermission> {
    return this.http.post<RolePermission>(`${environment.url_ms_security}/role-permission/permission/${permissionId}/role/${roleId}`, {});
  }

  delete(roleId: string, permissionId: string): Observable<RolePermission> {
    return this.http.delete<RolePermission>(`${environment.url_ms_security}/role-permission/permission/${permissionId}/role/${roleId}`);
  }


}
