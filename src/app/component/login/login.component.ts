import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user: User;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.user = new User();

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]], // fixed validators array
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.userService.login(this.loginForm.value).subscribe(
      (data: any) => {
        console.log(data);
        alert('Đăng nhập thành công');
        let jsonData = JSON.stringify(data);
        localStorage.setItem('login', jsonData);
        this.router.navigate(['/home']);
      },
      (error) => {
        // Handle authentication error (e.g., invalid credentials)
        console.error(error);
        alert('Sai mật khẩu hoặc email');
      }
    );
  }
}
