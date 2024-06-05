import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
  
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogin: any;
  isAdmin: any;

  constructor(private auth: AuthService, private httpClient: HttpClient) {
      this.isLogin = this.auth.checkLogin();
      this.isAdmin = this.auth.checkAdmin();
   }

  ngOnInit() {
  }

  onLogout() {
    localStorage.clear();
    location.reload;
  }

}
