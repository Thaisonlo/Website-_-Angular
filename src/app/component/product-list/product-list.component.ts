import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products!: Product[];
  id!: string;
  constructor(private productService: ProductService) {}

  ngOnInit() {
    return this.productService.getAll().subscribe((data) => {
      this.products = data as Product[];
      console.log(this.products)
    });
  }
  loadCategories() {
    this.productService.getAll().subscribe((data: any) => {
      this.products = data;
    });
  }

  deleteCategory(id: string) {
    if (confirm('Bạn có muốn xóa sản phẩm này không?')) {
      this.productService.delete(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}
