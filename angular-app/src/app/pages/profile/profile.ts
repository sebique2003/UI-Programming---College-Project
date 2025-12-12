import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WorkoutService } from '../../services/workoutService';
import { Workout } from '../../models/workout.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent {
  // Stores current user data from localStorage
  user: any = null;

  // Flag to track login status
  isLoggedIn = false;

  // Flag to toggle edit mode
  editing = false;

  // Flag to show toast
  showToast = false;

  // Editable user personal data
  userData = { name: '', age: '', height: '', weight: '' };

  // Favorite workouts organized by category
  favoriteCategories: { [category: string]: Workout[] } = {};

  // Workout progress per category
  categoryProgress: { [category: string]: number } = {};

  // Default list of workout categories
  defaultCategories = ['Push', 'Pull', 'Legs', 'Core', 'Full Body', 'Cardio'];

  constructor(private workoutService: WorkoutService) {}

  // Load user data and related info when the component initializes
  ngOnInit() {
    const storedUser = localStorage.getItem('currentUser');

    // If a user is found in localStorage
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.isLoggedIn = true;

      // Load saved user details (if any)
      const savedData = localStorage.getItem(`userData_${this.user.username}`);
      if (savedData) {
        this.userData = JSON.parse(savedData);
      }

      // Load progress and favorite workouts from the service
      this.categoryProgress = this.workoutService.getCategoryProgress();
      this.favoriteCategories = this.workoutService.favoriteCategories;
    }
  }

  // Save edited user data back to localStorage
  saveData() {
    if (!this.user) return;
    localStorage.setItem(`userData_${this.user.username}`, JSON.stringify(this.userData));
    this.editing = false;

    // Show toast
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  // Get all favorite category keys (names)
  getCategoryKeys(): string[] {
    return Object.keys(this.favoriteCategories || {});
  }

  // Get all categories that have progress data
  getProgressKeys(): string[] {
    const allKeys = new Set([
      ...this.defaultCategories.map((c) => c.toUpperCase()),
      ...Object.keys(this.categoryProgress || {}),
    ]);
    return Array.from(allKeys);
  }

  // Remove an entire favorite category and refresh local data
  removeFavorite(category: string) {
    this.workoutService.removeFavoriteCategory(category);
    this.favoriteCategories = this.workoutService.favoriteCategories;
  }
}
