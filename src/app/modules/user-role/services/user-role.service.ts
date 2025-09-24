import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRole } from '../models/user-role.model';

@Injectable({
  providedIn: 'root',
})
//Comment
export class UserRoleService {
  constructor(private http: HttpClient) {}
  list(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${environment.url_ms_security}/user-role`);
  }
  viewById(id: string): Observable<UserRole> {
    return this.http.get<UserRole>(`${environment.url_ms_security}/user-role/${id}`);
  }
  viewByUserId(userId: string): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${environment.url_ms_security}/user-role/user/${userId}`);
  }
  viewByRoleId(roleId: string): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${environment.url_ms_security}/user-role/role/${roleId}`);
  }
  create(userId: string, roleId: string): Observable<UserRole> {
    return this.http.post<UserRole>(`${environment.url_ms_security}/user-role/user/${userId}/role/${roleId}`, {});
  }
  deleteByUserAndRole(userId: string, roleId: string): Observable<UserRole> {
    return this.http.delete<UserRole>(`${environment.url_ms_security}/user-role/user/${userId}/role/${roleId}`);
  }

  delete(id: string) {
    return this.http.delete<UserRole>(`${environment.url_ms_security}/user-role/${id}`);
  }
}
