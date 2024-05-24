import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css'],
})
export class CategoryAddComponent implements OnInit {
  categoryForm: FormGroup;
  selectedFile: File | null = null;
  
  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      img: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.categoryForm.patchValue({ img: file.name });
      console.log(file)
    }
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      alert('Vui lòng nhập hợp lệ');
      console.log('Không hợp lệ');
      return;
    } else {
      const formData = new FormData();
      formData.append('name', this.categoryForm.get('name')?.value);
      if (this.selectedFile) {
        formData.append('img', this.selectedFile);
      }

      this.categoryService.save(formData).subscribe(data => {
        console.log(data);
        this.router.navigate(['category-list']);
        alert('Danh mục đã được thêm')
      });
    }
  }
}
