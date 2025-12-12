import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  // Stores the username of the logged-in user
  username = '';

  // Determines whether a user is logged in or not
  isLoggedIn = false;

  // Lifecycle hook that runs when the component initializes
  ngOnInit() {
    // Retrieve user data from local storage
    const user = localStorage.getItem('currentUser');

    // If user data exists, parse it and set the username
    if (user) {
      const parsedUser = JSON.parse(user);
      this.username = parsedUser.username;
      this.isLoggedIn = true;
    } 
    // If no user is found, set logged-in state to false
    else {
      this.isLoggedIn = false;
    }
  }
}
