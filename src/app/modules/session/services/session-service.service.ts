import { Injectable } from '@angular/core';
import { Session } from '../models/session.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private http: HttpClient) {}

  // Métodos:
  list(): Observable<Session[]> {
    return this.http.get<Session[]>(`${environment.url_ms_security}/sessions`);
  }

  view(id: string): Observable<Session> {
    return this.http.get<Session>(`${environment.url_ms_security}/sessions/${id}`);
  }

  create(newSession: Session): Observable<Session> {
    delete newSession._id;
    return this.http.post<Session>(`${environment.url_ms_security}/sessions`, newSession);
  }

  update(theSession: Session): Observable<Session> {
    return this.http.put<Session>(`${environment.url_ms_security}/sessions/${theSession._id}`, theSession);
  }

  delete(id: string): Observable<Session> {
    return this.http.delete<Session>(`${environment.url_ms_security}/sessions/${id}`);
  }
}
