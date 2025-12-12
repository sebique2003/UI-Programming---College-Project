import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { WorkoutService } from './workoutService';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Local array of registered users
  private users: User[] = [];

  // Reactive signal to track the currently logged-in user
  currentUser = signal<User | null>(null);

  constructor(private workouts: WorkoutService) {
    // Load all users from localStorage, or create a default test user
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    } else {
      this.users = [{ username: 'TestUser', email: 'test@test.com', password: '1234' }];
    }

    // Restore logged-in user from localStorage if one exists
    const savedCurrentUser = localStorage.getItem('currentUser');
    if (savedCurrentUser) {
      const user = JSON.parse(savedCurrentUser);
      this.currentUser.set(user);
      this.workouts.setCurrentUser(user.email); // Link user data to workouts
    }
  }

  // Save all registered users to localStorage
  private saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  // Attempt to log in using email and password
  login(email: string, password: string): boolean {
    const found = this.users.find((u) => u.email === email && u.password === password);
    if (found) {
      // If credentials match, set the current user and save it
      this.currentUser.set(found);
      localStorage.setItem('currentUser', JSON.stringify(found));
      this.workouts.setCurrentUser(found.email); // Load workouts for this user
      return true;
    }
    return false; // Login failed
  }

  // Register a new user (if email or username not already used)
  signup(username: string, email: string, password: string): boolean {
    if (this.users.find((u) => u.email === email || u.username === username)) return false;

    const newUser = { username, email, password };
    this.users.push(newUser);
    this.saveUsers();

    // Set new user as logged in right after signup
    this.currentUser.set(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    this.workouts.setCurrentUser(email); // Initialize workout data for new user
    return true;
  }

  // Log out the current user
  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  // Check if someone is currently logged in
  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
