import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
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
  private currentUser: any;

  constructor(private http: HttpClient) {
    this.currentUser = localStorage.getItem('currentUser');
    if (this.currentUser != null)
      this.currentUser = JSON.parse(this.currentUser);
  }

  login(user: User): Observable<any> {
    const request = this.http.post(
      `${API_URL}/users/authenticate`,
      user,
      httpOptions
    );

    request.subscribe((user) => {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
    });

    return request;
  }

  me() {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}
