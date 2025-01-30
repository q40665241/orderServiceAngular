import { Component, OnInit } from '@angular/core';
import { ProductService } from './products.service'; // Import ProductService

@Component({
  selector: 'app-product-profile',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  errorMessage: string = '';
  productForm = { id: null, name: '', description: '', price: 0, quantity: 0 }; // Model for adding/updating products
  isEditMode: boolean = false;

  constructor(private productService: ProductService) {} // Inject ProductService

  ngOnInit(): void {
    this.getProducts();
  }

  // Get all products using ProductService
  getProducts(): void {
    this.productService.getProducts().subscribe(
      (response) => {
        this.products = response;
      },
      (error) => {
        this.errorMessage = 'Failed to load product data. Please try again later.';
        console.error('Error fetching product data:', error);
      }
    );
  }

  // Add a product using ProductService
  addProduct(): void {
    this.productService.addProduct(this.productForm).subscribe(
      (response) => {
        this.products.push(response);
        this.resetForm();
      },
      (error) => {
        console.error('Error adding product:', error);
      }
    );
  }

  // Delete a product using ProductService
  deleteProduct(productId: number): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(productId).subscribe(
      () => {
        this.products = this.products.filter((product) => product.id !== productId);
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );
  }

  // Edit a product (populate the form with product data)
  editProduct(product: any): void {
    this.productForm = { ...product };
    this.isEditMode = true;
  }

  // Update a product using ProductService
  updateProduct(): void {
    this.productService.updateProduct(this.productForm).subscribe(
      (response) => {
        const index = this.products.findIndex((product) => product.id === this.productForm.id);
        if (index !== -1) {
          this.products[index] = { ...this.productForm };
        }
        this.resetForm();
      },
      (error) => {
        console.error('Error updating product:', error);
      }
    );
  }

  // Cancel edit mode
  cancelEdit(): void {
    this.resetForm();
  }

  // Reset form
  resetForm(): void {
    this.productForm = { id: null, name: '', description: '', price: 0, quantity: 0 };
    this.isEditMode = false;
  }
}
