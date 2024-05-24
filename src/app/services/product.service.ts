import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = 'http://localhost:3000/api';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.url}/products`);
  }

  get(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.url}/products/${id}`);
  }

  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/products/${id}`);
  }

  save(product: Product, image?: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('categoryId', product.categoryId.toString());
    formData.append('description', product.description);
    if (image) {
      formData.append('img', image, image.name);
    }
    return this.httpClient.post<any>(`${this.url}/products/add`, formData);
  }

  update(id: Number ,formData: FormData){
    return this.httpClient.put(`${this.url}/products/${id}`, formData);
  }
}
