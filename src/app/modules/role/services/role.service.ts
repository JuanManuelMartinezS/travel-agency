import { Injectable } from '@angular/core';
import { Role } from '../models/role.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
    constructor(private http: HttpClient) {}
    
    // Metodos:
    list(): Observable<Role[]> {
      return this.http.get<Role[]>(`${environment.url_ms_security}/roles`);
    }
    view(id: number): Observable<Role> {
      return this.http.get<Role>(`${environment.url_ms_security}/roles/${id}`);
    }
    create(newRole: Role): Observable<Role> {
      delete newRole.id;
      return this.http.post<Role>(`${environment.url_ms_security}/roles`, newRole);
    }
    update(theRole: Role): Observable<Role> {
      return this.http.put<Role>(`${environment.url_ms_security}/roles/${theRole.id}`, theRole)
    }
    delete(id: number): Observable<Role> {
      return this.http.delete<Role>(`${environment.url_ms_security}/roles/${id}`);
    }
}
