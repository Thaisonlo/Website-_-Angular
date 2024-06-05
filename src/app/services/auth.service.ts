import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'http://localhost:3000/api';

  loggedIn = false;

constructor(private httpClient: HttpClient) { }

  //Auth
  isAuthenticated() {
    const promise = new Promise<boolean>((resolve, reject) => {
      let jsonData = localStorage.getItem('login');
      if (jsonData) {
        this.loggedIn = true;
        resolve(this.loggedIn)
      } else {
        resolve(this.loggedIn)
      }
    });
    return promise;
  }

  //Admin
  isAdmin() {
    const promise = new Promise<boolean>((resolve, reject) => {
      let jsonData = localStorage.getItem('login');
      // console.log('ádhfasj;')
      if (jsonData) {
        if (JSON.parse(jsonData).admin = 1) {
          this.loggedIn = true;
          resolve(this.loggedIn)
        }
      } else {
        alert('Bạn không có quyền truy cập!')
        resolve(this.loggedIn)
      }
    });
    return promise;
  }

  checkLogin() {
    let jsonData = localStorage.getItem('login');
    if (jsonData) {
      return JSON.parse(jsonData)
    }
    return false
  }

  checkAdmin() {
    let jsonData = localStorage.getItem('login');
    if (jsonData) {
      if (JSON.parse(jsonData).admin = 1)
        return JSON.parse(jsonData)
    }
    return false
  }

  //hàm đăng ký
  register(body: any): any{
    return this.httpClient.post<any>(`${this.url}/account/add`, body);
  } 

  //hàm đăng nhập
  login(body: any): any{
    return this.httpClient.post<any>(`${this.url}/account/login`, body);
  } 
}
