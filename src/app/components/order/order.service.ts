import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl: string = 'http://localhost:8080/api/order';

  constructor(private http: HttpClient) {}

  // Get all orders
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a new order
// Create a new order for a user
createOrder(userId: number|null): Observable<any> {
    const url = `${this.apiUrl}?userId=${userId}`;
    return this.http.post<any>(url, {}); // Send an empty body
  }
  
  deleteOrder(orderId: number): Observable<any> {
    const url = `${this.apiUrl}/${orderId}`;
    return this.http.delete<any>(url);
  }
  
  
// Remove a product from an order
removeProduct(orderId: number|null, productId: number|null): Observable<any> {
    const url = `${this.apiUrl}/deleteProduct?orderId=${orderId}&productId=${productId}`;
    return this.http.delete<any>(url);
  }
  //Update an order
  updateOrder(orderId: number|null, productId: number|null, userId: number|null): void {
        const url = `${this.apiUrl}/addProduct?orderId=${orderId}&productId=${productId}&userId=${userId}`;
        this.http.post<any>(url, {}).subscribe({
        next: () => {
           
        },
        error: (error) => {
            console.error('Error adding product:', error);
            alert('Failed to add product. ' + (error.error.message || 'Please try again.'));
        },
        });
    }
}
