import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://localhost:3000/api';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.url}/users`);
  }

  get(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.url}/users/${id}`);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/users/${id}`);
  }

  save(user: User | FormData): Observable<any> {
    if (user instanceof FormData) {
      return this.httpClient.post<any>(`${this.url}/register`, user);
    } else {
      const formData = new FormData();
      formData.append('fullName', user.fullName);
      formData.append('email', user.email);
      formData.append('password', user.password);
      if (user.img) {
        formData.append('img', user.img);
      }
      return this.httpClient.post<any>(`${this.url}/register`, formData);
    }
  }

  update(id: string, formData: FormData): Observable<any> {
    return this.httpClient.put(`${this.url}/users/${id}`, formData);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    console.log(credentials);
    return this.httpClient.post(`${this.url}/login`, credentials);
  }
}
