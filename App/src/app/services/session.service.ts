import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as setup from './setup.json';

const API_URL = setup.API_URL;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() { }

  login(username: String, password: String): void {
    if (username != '' && password != '')
      console.log(`Login: {${username}, ${password}}`);
    else console.log('You need to enter the username and the password!');
  }

  me() { }

  logout() { }
}
