import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = 'http://localhost:3000/api';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.url}/categories`);
  }

  get(id: string): Observable<Category> {
    return this.httpClient.get<Category>(`${this.url}/categories/${id}`);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/categories/${id}`);
  }

  save(category: Category | FormData): Observable<any> {
    if (category instanceof FormData) {
      return this.httpClient.post<any>(`${this.url}/categories/add`, category);
    } else {
      // If category is a Category object, convert it to FormData
      const formData = new FormData();
      formData.append('name', category.name);
      formData.append('img', category.img); // Assuming img is a file name or URL
      // Add other properties as needed
      return this.httpClient.post<any>(`${this.url}/categories/add`, formData);
    }
  }

  update(id: string, formData: FormData){
    return this.httpClient.put(`${this.url}/categories/${id}`, formData);
  }
}
