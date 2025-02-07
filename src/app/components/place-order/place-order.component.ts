import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-profile/user-profile.service';
import { ProductService } from '../products/products.service';
import { OrderService } from '../order/order.service'; 

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface User {
  id: number;
  name: string;
}

interface Order {
  id: number;
  user: User;
  products: Product[];
}

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
  username: string = '';
  selectedUser: User | null = null;
  isUsernameEntered: boolean = false;
  users: User[] = [];
  products: Product[] = [];
  cart: Product[] = [];
  isCartOpen: boolean = false; // Cart modal state
  hintMessage: string = '';
  errorMessage: string = '';
  orderId: number | null = null;
  productImageMap = {
    default: 'https://cdn.informaconnect.com/platform/files/public/2021-02/background/600x450/2021-Hero-Shot-Logo-Trans_1613683862.jpg?VersionId=eQrnWua8OHfFHX99jQRs5_uA.XgO6kzH'
  };
  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.getProducts();
    this.loadCart(); // Load cart from localStorage
    
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
        this.loadUsername(); // Now we load the username
      },
      (error) => console.error('Error fetching users:', error)
    );
  }
  
  loadUsername() {
    
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      this.username = savedUsername;
      this.selectedUser = this.users.find(user => user.name.toLowerCase() === savedUsername.toLowerCase()) || null;
      this.isUsernameEntered = !!this.selectedUser;
    
    }
  }
  logout() {
    localStorage.removeItem('username'); // Remove saved username
    localStorage.removeItem('cart'); // Optional: Clear the cart on logout
    this.cart = []; // Clear the cart after checkout
    this.saveCart();
    this.username = '';
    this.selectedUser = null;
    this.isUsernameEntered = false;
    this.hintMessage = 'You have logged out.';
  }
  
  getProducts(): void {
    this.productService.getProducts().subscribe(
      (response: Product[]) => {
        this.products = response.map(product => ({
          ...product,
          image: this.productImageMap.default // Assign the same image to all products
        }));
      },
      (error) => console.error('Error fetching products:', error)
    );
  }

  enterUsername() {
    this.selectedUser = this.users.find(user => user.name.toLowerCase() === this.username.toLowerCase()) || null;
    if (this.selectedUser) {
      this.isUsernameEntered = true;
      this.hintMessage = `Welcome back, ${this.selectedUser.name}!`;
      localStorage.setItem('username', this.username); // Save username

    } else {
      this.hintMessage = 'User not found. Cannot start shopping.';
      this.isUsernameEntered = false;
    }
  }

  addToCart(product: Product) {
    const existingProduct = this.cart.find(p => p.id === product.id);
    
    if (existingProduct) {
      if ((existingProduct.quantity ?? 0) < product.quantity) {
        existingProduct.quantity! += 1;
      } else {
        alert('Stock limit reached!');
      }
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    
    this.saveCart(); // Save cart to localStorage
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter(p => p.id !== productId);
    this.saveCart(); // Save updated cart to localStorage
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      console.log("Loaded Cart:", this.cart);

    }
  }

  get totalPrice() {
    return this.cart.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0);
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  checkout() {
    if (!this.isUsernameEntered) {
      alert('Please enter a valid username before placing an order.');
      return;
    }

    if (this.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    this.addOrder();
  }

  addOrder(): void {
   
    if (!this.selectedUser) return;
    console.log("Cart checked in addorder:", this.cart);

    console.log("check out");
    this.orderService.createOrder(this.selectedUser.id).subscribe(
      (response: { id: number }) => {
        this.orderId = response.id; // Store order ID
        this.updateOrder(); // Step 2: Update Order with Products
      },
      (error) => {
        this.errorMessage = 'Error adding order';
        console.error('Error:', error);
      }
    );
  }

  updateOrder(): void {
    console.log("Cart:", this.cart);

    console.log("Order ID:", this.orderId);
    console.log("Selected User:", this.selectedUser);
     
    if (!this.orderId || !this.selectedUser) {
      this.errorMessage = 'Order not found or user not selected.';
      return;
    }

    if (this.cart.length === 0) {
       alert('Cart is empty, cannot update order.');
      return;
    }
    alert('updateing');
    for (const product of this.cart) {
      this.orderService.updateOrder(this.orderId, product.id, this.selectedUser.id);
      
    }
    this.cart = [];
    this.saveCart();
    alert('Order placed successfully!');

  }
}
