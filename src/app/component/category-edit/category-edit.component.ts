import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})

export class CategoryEditComponent implements OnInit {
  categoryForm: FormGroup;
  category!: Category;
  id: string;
  selectedFile: File | null = null;


  constructor(private route: ActivatedRoute, private categoryService: CategoryService, private router: Router) {
    this.id = route.snapshot.params['id'];
    this.categoryForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      img: new FormControl(''),
    });
  }

  ngOnInit() {
    this.categoryService.get(this.id).subscribe((data) => {
      this.category = data as Category;
      this.categoryForm.patchValue({
        id: this.category.id,
        name: this.category.name,
        img: this.selectedFile ? this.selectedFile.name : '', // Ban đầu đặt img thành tên tệp hoặc chuỗi trống
      });
      console.log(this.category);
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.categoryForm.patchValue({ img: file.name });
      console.log(file);
    }
  }
  

  onSubmit() {
    if (this.categoryForm.invalid) {
      alert('Vui lòng nhập thông tin hợp lệ');
      return console.log('Không hợp lệ');
    } else {
      const formData = new FormData();
      formData.append('name', this.categoryForm.get('name')?.value);
      if (this.selectedFile) {
        formData.append('img', this.selectedFile);
      }
      const id = this.categoryForm.get('id')?.value;
      this.categoryService.update(id, formData).subscribe((data) => {
        console.log(data);
        alert('Cập nhật thành công');
        this.router.navigate(['/category-list']);
      });
    }
  }   
}