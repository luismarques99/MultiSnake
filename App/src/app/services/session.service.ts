import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

const API_URL = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private currentUser: BehaviorSubject<any>;
  public expired: boolean;

  constructor(private http: HttpClient) {
    let user = localStorage.getItem('currentUser');
    if (user != null) user = JSON.parse(user);

    this.currentUser = new BehaviorSubject(user);

    this.expired = false;
  }

  login(user: User): Observable<any> {
    const request = this.http
      .post(`${API_URL}/users/authenticate`, user, httpOptions)
      .pipe(share());

    request.subscribe((response) => {
      this.currentUser.next(response);
      localStorage.setItem('currentUser', JSON.stringify(response));
    });

    return request;
  }

  me(): Observable<any> {
    return this.currentUser;
  }

  logout() {
    this.expired = false;
    this.currentUser.next(null);
    localStorage.removeItem('currentUser');
  }

  clearSession() {
    this.expired = true;
    this.currentUser.next(null);
    localStorage.removeItem('currentUser');
  }
}
