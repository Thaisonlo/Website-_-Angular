import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { 
    this.userForm = this.formBuilder.group({
      fullName: ['', [Validators.required, this.fullNameValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      respass: ['', [Validators.required, Validators.minLength(8)]],
      img: ['', Validators.required]
    });

    this.userForm.setValidators(this.passwordMathValidator());
  }

  ngOnInit() {}

  passwordMathValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const respass = formGroup.get('respass')?.value;

      if(password !== respass) {
        return {mismatch: true};
      } else {
        alert('Mật khẩu không trùng, vui lòng nhập lại')
        return null;
      }
    }
  }

  fullNameValidator(control: any) {
    const forbiddenWords = ['ma túy', 'hàng trắng'];

    if (forbiddenWords.some(word => control.value.toLowerCase().includes(word))) {
      return { forbiddenWords: true }
    }
    return null;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.userForm.patchValue({
        img: file
      });
      this.userForm.get('img')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      alert('Please enter valid information');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', this.userForm.get('fullName')?.value); // Use 'fullName' here
    formData.append('email', this.userForm.get('email')?.value);
    formData.append('password', this.userForm.get('password')?.value);
    formData.append('respass', this.userForm.get('respass')?.value);
    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }

    this.userService.save(formData).subscribe(
      (response) => {
        alert('Đăng ký thành công');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error);
        alert('Đăng ký thất bại');
      }
    );
  }
}
