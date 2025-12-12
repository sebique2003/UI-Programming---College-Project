import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  // --- Component state ---
  menuActive = false;        // Controls mobile menu visibility
  isLoggedIn = false;        // Auth status
  username = '';             // Logged-in username
  showLogoutPopup = false;   // Controls logout popup visibility

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    // Check login status
    this.isLoggedIn = this.auth.isLoggedIn();

    // Load username from local storage if available
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.username = user.username;
    }
  }

  // --- Menu control ---
  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  closeMenu() {
    this.menuActive = false;
  }

  // --- Logout popup control ---
  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  confirmLogout() {
    this.auth.logout();
    this.isLoggedIn = false;
    this.username = '';
    this.showLogoutPopup = false;

    // Redirect to auth page
    this.router.navigate(['/auth']);
    this.closeMenu();
  }

  cancelLogout() {
    this.showLogoutPopup = false;
  }

  // --- Navigation ---
  goToAuth() {
    this.closeMenu();
    this.router.navigate(['/auth']);
  }
}
