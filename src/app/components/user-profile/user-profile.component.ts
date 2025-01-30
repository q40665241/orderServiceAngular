import { Component, OnInit } from '@angular/core';
import { UserService } from './user-profile.service'; // Import the UserService

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';
  userForm = { id: null, name: '', email: '' }; // Model for adding/updating users
  isEditMode: boolean = false;

  constructor(private userService: UserService) {} // Inject UserService

  ngOnInit(): void {
    this.getUsers();
  }

  // Get all users using the UserService
  getUsers(): void {
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        this.errorMessage = 'Failed to load user data. Please try again later.';
        console.error('Error fetching user data:', error);
      }
    );
  }

  // Add a user using the UserService
  addUser(): void {
    this.userService.addUser(this.userForm).subscribe(
      (response) => {
        this.users.push(response);
        this.resetForm();
      },
      (error) => {
        console.error('Error adding user:', error);
      }
    );
  }

  // Delete a user using the UserService
  deleteUser(userId: number): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userService.deleteUser(userId).subscribe(
      () => {
        this.users = this.users.filter((user) => user.id !== userId);
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  // Edit a user (populate the form with user data)
  editUser(user: any): void {
    this.userForm = { ...user };
    this.isEditMode = true;
  }

  // Update a user using the UserService
  updateUser(): void {
    this.userService.updateUser(this.userForm).subscribe(
      (response) => {
        const index = this.users.findIndex((user) => user.id === this.userForm.id);
        if (index !== -1) {
          this.users[index] = { ...this.userForm };
        }
        this.resetForm();
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  // Cancel edit and reset the form
  cancelEdit(): void {
    this.resetForm();
  }

  // Reset the user form
  resetForm(): void {
    this.userForm = { id: null, name: '', email: '' };
    this.isEditMode = false;
  }
}

