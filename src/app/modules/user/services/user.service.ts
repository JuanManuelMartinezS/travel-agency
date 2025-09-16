import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }
  list(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.url_ms_security}/users`);
  }
  view(id: number): Observable<User> {
    return this.http.get<User>(`${environment.url_ms_security}/users/${id}`);
  }
  create(newUser: User): Observable<User> {
    delete newUser._id;
    return this.http.post<User>(`${environment.url_ms_security}/users`, newUser);
  }
  update(theUser: User): Observable<User> {
    return this.http.put<User>(`${environment.url_ms_security}/users/${theUser._id}`, theUser);
  }

  delete(id: number) {
    return this.http.delete<User>(`${environment.url_ms_security}/users/${id}`);
  }

}
