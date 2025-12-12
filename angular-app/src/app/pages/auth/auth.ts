import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class AuthComponent {
  // Form input fields
  email = '';
  password = '';
  confirmPassword = '';
  username = '';

  // Switch between signup and login modes
  isSignup = false;

  // Toast notification state
  toastMessage = '';
  toastVisible = false;
  toastType: 'success' | 'error' | 'info' = 'info';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Automatically switch to signup mode if ?mode=signup is in the URL
    this.route.queryParams.subscribe((params) => {
      if (params['mode'] === 'signup') {
        this.isSignup = true;
      }
    });
  }

  // Toggle between login and signup
  toggleMode() {
    this.isSignup = !this.isSignup;
    this.toastMessage = '';
  }

  // Handle form submission
  onSubmit() {
    // Username validation (for signup only)
    if (this.isSignup && !this.username.trim()) {
      this.showError('Please enter a username.');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (this.isSignup && !usernameRegex.test(this.username)) {
      this.showError('Username can only contain letters and numbers.');
      return;
    }

    // Email validation
    if (!this.email.trim()) {
      this.showError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showError('Please enter a valid email address.');
      return;
    }

    // Password validation
    if (!this.password.trim()) {
      this.showError('Please enter your password.');
      return;
    }

    if (this.password.length < 6) {
      this.showError('Password must be at least 6 characters long.');
      return;
    }

    // Additional signup validations
    if (this.isSignup) {
      const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])/;
      if (!strongPassword.test(this.password)) {
        this.showError('Password must include at least one uppercase and one lowercase letter.');
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.showError('Passwords do not match.');
        return;
      }
    }

    // Handle signup
    if (this.isSignup) {
      const success = this.auth.signup(this.username, this.email, this.password);
      if (success) {
        this.showMessage('Account created successfully!');
        setTimeout(() => this.router.navigate(['/home']), 1500);
      } else {
        this.showError('User already exists!');
      }

    // Handle login
    } else {
      const success = this.auth.login(this.email, this.password);
      if (success) {
        this.showMessage('Login successful!');
        setTimeout(() => this.router.navigate(['/home']), 1500);
      } else {
        this.showError('Invalid credentials! Please check your email and password.');
      }
    }
  }

  // Toast success message
  private showMessage(msg: string) {
    this.showToast(msg, 'success');
  }

  // Toast error message
  private showError(msg: string) {
    this.showToast(msg, 'error');
  }

  // Generic toast display function
  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    setTimeout(() => (this.toastVisible = false), 2500);
  }
}
