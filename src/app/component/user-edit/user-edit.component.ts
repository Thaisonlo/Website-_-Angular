import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  user!: User;
  id: string;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.id = this.route.snapshot.params['id'];
    this.userForm = new FormGroup({
      id: new FormControl(null),
      fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      img: new FormControl(''),
      isAdmin: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.userService.get(this.id).subscribe((data) => {
      this.user = data as User;
      this.userForm.patchValue({
        id: this.user.id,
        fullName: this.user.fullName,
        email: this.user.email,
        isAdmin: this.user.isAdmin,
        img: this.selectedFile ? this.selectedFile.name : this.user.img,
      });
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.userForm.patchValue({ img: file.name });
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      alert('Vui lòng nhập hợp lệ');
      return console.log('Form is invalid');
    }

    const formData = new FormData();
    formData.append('fullName', this.userForm.get('fullName')?.value);
    formData.append('email', this.userForm.get('email')?.value);
    formData.append('isAdmin', this.userForm.get('isAdmin')?.value);
    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }
    const id = this.userForm.get('id')?.value;
    this.userService.update(id, formData).subscribe((data) => {
      console.log(data);
      alert('Thông tin đã được cập nhật');
      this.router.navigate(['user-list']);
    });
  }
}
