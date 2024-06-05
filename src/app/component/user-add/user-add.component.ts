import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  userForm: FormGroup;
  users!: User[];
  selectedFile: File | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = new FormGroup({
      fullname: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      img: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    this.userService.getAll().subscribe(data => {
      this.users = data as User[];
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      alert('Vui lòng nhập thông tin hợp lệ');
      console.log('Form không hợp lệ');
      return;
    }

    const user: User = {
      fullName: this.userForm.get('fullName')?.value,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value,
      img: this.selectedFile ?? undefined
    };

    // Create FormData object
    const formData = new FormData();
    formData.append('fullName', user.fullName);
    formData.append('email', user.email);
    formData.append('password', user.password);
    if (this.selectedFile) {
      formData.append('img', this.selectedFile, this.selectedFile.name);
    }

    this.userService.save(formData).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/user-list']);
        alert('Người dùng đã được thêm');
      },
      error => {
        console.error(error);
        alert('Có lỗi xảy ra khi thêm người dùng');
      }
    );
  }
}
