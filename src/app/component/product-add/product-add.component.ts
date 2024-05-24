import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  productForm: FormGroup;
  categories!: Category[];
  selectedFile: File | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.productForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'price': new FormControl(null, [Validators.required]),
      'categoryId': new FormControl(null, [Validators.required]),
      'description': new FormControl('', Validators.required),
      'img': new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.categoryService.getAll().subscribe(data => {
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
      alert('Vui lòng nhập thông tin hợp lệ');
      console.log('Form không hợp lệ');
      return;
    }

    const product: Product = {
      name: this.productForm.get('name')?.value,
      price: parseFloat(this.productForm.get('price')?.value),
      categoryId: parseInt(this.productForm.get('categoryId')?.value),
      description: this.productForm.get('description')?.value,
      img: this.selectedFile ? this.selectedFile.name : '' // Initially set img to the file name or empty string
    };

    // Ensure image is File or undefined
    const image = this.selectedFile ?? undefined;

    this.productService.save(product, image).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/product-list']);
        alert('Sản phẩm đã được thêm');
      },
      error => {
        console.error(error);
        alert('Có lỗi xảy ra khi thêm sản phẩm');
      }
    );
  }
}
