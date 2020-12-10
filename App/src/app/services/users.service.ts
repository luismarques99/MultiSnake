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
export class UsersService {
  constructor(private http: HttpClient) {}

  createUser(newUser: User): Observable<any> {
    return this.http.post(`${API_URL}/users`, newUser, httpOptions);
  }

  getUserById(id: number, options: any): Observable<any> {
    return this.http.get(`${API_URL}/users/${id}`, options);
  }

  partialUpdateUser(id: number, body: any, options: any): Observable<any> {
    const user = JSON.stringify(body);
    return this.http.patch(`${API_URL}/users/${id}`, user, options);
  }
}
