import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-profile/user-profile.service';
import { ProductService } from '../products/products.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  users: any[] = [];
  products: any[] = [];
  errorMessage: string = '';

  orderForm = {
    id: null,
    orderDate: '',
    user: { id: null },
    status: 'Pending',
    products: [{ id: null, quantity: 1 }],
  };

  isEditMode: boolean = false;

  constructor(
    private userService: UserService, 
    private productService: ProductService,
    private orderService: OrderService // Use OrderService for API calls
  ) {}

  ngOnInit(): void {
    this.getOrders();
    this.getUsers();
    this.getProducts();
  }

  getOrders(): void {
    this.orderService.getOrders().subscribe(
      (response) => (this.orders = response),
      (error) => (this.errorMessage = 'Error fetching orders')
    );
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response;
        if (this.users.length > 0 && !this.isEditMode) {
          this.orderForm.user.id = this.users[0].id; // Default to first user
        }
      },
      (error) => console.error('Error fetching users:', error)
    );
  }
  

  getProducts(): void {
    this.productService.getProducts().subscribe(
      (response) => (this.products = response),
      (error) => console.error('Error fetching products:', error)
    );
  }

  addProduct(): void {
    this.orderForm.products.push({ id: null, quantity: 1 });
  }
  

  removeProduct(index: number): void {
    const product = this.orderForm.products[index];
  
    if (product.id) {
      // Call the backend to remove the product from the order
      this.orderService.removeProduct(this.orderForm.id, product.id).subscribe({
        next: (updatedOrder) => {
          this.orderForm.products = updatedOrder.products; // Update UI only if successful
          alert('Product has been successfully removed.');
          this.getOrders(); // Refresh order list
          this.resetForm();
        },
        error: (error) => {
          console.error('Error removing product:', error);
          alert('Failed to remove product. ' + (error.error.message || 'Please try again.'));
        }
      });
    } else {
      console.warn('Product has no ID, skipping removal.');
    }
  }
  
  

  addOrder(): void {
 
    if (!this.orderForm.user || this.orderForm.user.id === null) {
      this.errorMessage = 'Please select a user before adding an order.';
      return;
    }
  
    this.orderService.createOrder(this.orderForm.user.id).subscribe(
      (response) => {
        this.getOrders(); // Refresh order list
        this.resetForm();
      },
      (error) => {
        this.errorMessage = 'Error adding order';
        console.error('Error:', error);
      }
    );
  }
  
  
  
  

  editOrder(order: any): void {
    this.isEditMode = true;
    this.orderForm = {
      ...order,
      products: order.products.map((product: { id: any; }) => ({
        id: product.id,
        existing: true // Mark existing products as read-only
      }))
    };
    const formElement = document.getElementById('order-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  updateOrder(): void {
    if (!this.orderForm.user || !this.orderForm.user.id) {
      this.errorMessage = 'Please select a user before updating the order.';
      return;
    }
  
    if (!this.orderForm.products || this.orderForm.products.length === 0) {
      this.errorMessage = 'Please add at least one product before updating the order.';
      return;
    }
  
    for (const product of this.orderForm.products) {
      this.orderService.updateOrder(this.orderForm.id, product.id, this.orderForm.user.id);
         
    }
    alert('Product added successfully!');
    this.getOrders(); // Refresh order list
    this.resetForm();
  }
  
   

  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: (response) => {
          console.log('Order deleted successfully:', response.message);
          alert(response.message); // Show alert from response
          this.getOrders(); // Refresh order list
          this.resetForm();
        },
        error: (error) => {
          console.error('Error deleting order:', error);
          alert('Failed to delete order. ' + (error.error?.message || 'Please try again.'));
        }
      });
    }
  }
  
  
  

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.isEditMode = false;
    this.orderForm = {
      id: null,
      orderDate: '',
      user: { id: this.users.length > 0 ? this.users[0].id : null }, // Set default user
      status: 'Pending',
      products: [{ id: null, quantity: 1 }],
    };
  }
  
}
