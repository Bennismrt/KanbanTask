import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Service akan tersedia di seluruh aplikasi
})
export class HomepageService {
  private baseUrl = 'https://mocki.io/v1/e5f26750-17e9-487b-93fe-2d1ff07c3da8'; // Ganti dengan URL API yang sesuai

  constructor(private http: HttpClient) {}

  // GET Request
  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // POST Request
  postData(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  // PUT Request
  putData(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}`, data);
  }

  // DELETE Request
  deleteData(endpoint: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}`);
  }
}
