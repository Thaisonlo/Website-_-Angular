import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit {
  productForm: FormGroup;
  product!: Product;
  categories: Category[] = [];
  id: string;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.productForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
      price: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      img: new FormControl(''),
    });
  }

  ngOnInit() {
    this.productService.get(this.id).subscribe((data) => {
      this.product = data as Product;
      this.productForm.patchValue({
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        categoryId: this.product.categoryId,
        description: this.product.description,
        img: this.selectedFile ? this.selectedFile.name : '', // Ban đầu đặt img thành tên tệp hoặc chuỗi trống
      });
      console.log(this.product);
    });
    this.categoryService.getAll().subscribe((data) => {
      this.categories = data as Category[];
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.productForm.patchValue({ img: file.name });
      console.log(file);
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      alert('Vui lòng nhập hợp lệ');
      return console.log('không hợp lệ');
    } else {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append(
        'description',
        this.productForm.get('description')?.value
      );
      formData.append('categoryId', this.productForm.get('categoryId')?.value);
      if (this.selectedFile) {
        formData.append('img', this.selectedFile);
      }
      const id = this.productForm.get('id')?.value;
      this.productService.update(id, formData).subscribe((data) => {
        console.log(data);
        alert('Thông tin đã được cập nhật')
        this.router.navigate(['product-list']);
      });
    }
  }
}
