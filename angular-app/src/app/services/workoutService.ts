import { Injectable, signal, effect } from '@angular/core';
import { Workout } from '../models/workout.model';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  // Reactive signals for workouts, favorites, and progress tracking
  private workoutsSignal = signal<Workout[]>([]);
  private favoriteCategoriesSignal = signal<{ [category: string]: Workout[] }>({});
  private categoryProgressSignal = signal<{ [category: string]: number }>({});

  // Keys for localStorage (dynamic per user)
  private currentUserKey = '';
  private favoritesKey = '';
  private progressKey = '';

  // Default categories used in the app
  private defaultCategories = [
    'PUSH',
    'PULL',
    'LEGS',
    'CORE',
    'FULL BODY',
    'CARDIO',
  ];

  constructor() {
    // Load the current user from localStorage (if logged in)
    const user = localStorage.getItem('currentUser');
    if (user) {
      const email = JSON.parse(user).email;
      this.setCurrentUser(email);
    }

    // Automatically update favorites whenever workouts change
    effect(() => {
      const workouts = this.workoutsSignal();
      const currentFavorites = { ...this.favoriteCategoriesSignal() };
      let updated = false;

      // Loop through favorite categories and refresh their data
      for (const category in currentFavorites) {
        const updatedList = workouts.filter(
          (w) => w.category.trim().toUpperCase() === category
        );

        if (JSON.stringify(updatedList) !== JSON.stringify(currentFavorites[category])) {
          currentFavorites[category] = updatedList;
          updated = true;
        }
      }

      // Save updated favorites to localStorage if changes were made
      if (updated) {
        this.favoriteCategoriesSignal.set(currentFavorites);
        this.saveFavorites();
      }
    });
  }

  // Load workouts from localStorage
  private loadWorkouts() {
    if (!this.currentUserKey) return;
    const saved = localStorage.getItem(this.currentUserKey);
    this.workoutsSignal.set(saved ? JSON.parse(saved) : []);
  }

  // Save workouts to localStorage
  private saveWorkouts() {
    if (this.currentUserKey) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(this.workoutsSignal()));
    }
  }

  // Load favorite categories from localStorage
  private loadFavorites() {
    if (!this.favoritesKey) return;
    const saved = localStorage.getItem(this.favoritesKey);
    this.favoriteCategoriesSignal.set(saved ? JSON.parse(saved) : {});
  }

  // Save favorite categories to localStorage
  private saveFavorites() {
    if (this.favoritesKey) {
      localStorage.setItem(this.favoritesKey, JSON.stringify(this.favoriteCategoriesSignal()));
    }
  }

  // Load progress data from localStorage
  private loadProgress() {
    if (!this.progressKey) return;
    const saved = localStorage.getItem(this.progressKey);
    const loadedProgress = saved ? JSON.parse(saved) : {};

    // Ensure all default categories exist with initial value 0
    this.defaultCategories.forEach(cat => {
      const upper = cat.toUpperCase();
      if (!(upper in loadedProgress)) {
        loadedProgress[upper] = 0;
      }
    });

    this.categoryProgressSignal.set(loadedProgress);
  }

  // Save progress data to localStorage
  private saveProgress() {
    if (this.progressKey) {
      localStorage.setItem(this.progressKey, JSON.stringify(this.categoryProgressSignal()));
    }
  }

  // Set user keys based on logged-in user email
  setCurrentUser(email: string) {
    this.currentUserKey = `workouts_${email}`;
    this.favoritesKey = `favorites_${email}`;
    this.progressKey = `progress_${email}`;
    this.loadWorkouts();
    this.loadFavorites();
    this.loadProgress();
  }

  // Expose workouts as read-only signal
  get workouts() {
    return this.workoutsSignal.asReadonly();
  }

  // Add new workout
  addWorkout(workout: Workout) {
    const newList = [...this.workoutsSignal(), workout];
    this.workoutsSignal.set(newList);
    this.saveWorkouts();
  }

  // Delete a workout by ID
  deleteWorkout(id: number) {
    const filtered = this.workoutsSignal().filter((w) => w.id !== id);
    this.workoutsSignal.set(filtered);
    this.saveWorkouts();
  }

  // Update an existing workout
  updateWorkout(updatedWorkout: Workout) {
    const updatedList = this.workoutsSignal().map((w) =>
      w.id === updatedWorkout.id ? updatedWorkout : w
    );
    this.workoutsSignal.set(updatedList);
    this.saveWorkouts();
  }

  // Toggle category as favorite or remove it
  toggleFavoriteCategory(category: string, workouts: Workout[]) {
    const current = { ...this.favoriteCategoriesSignal() };
    const upper = category.trim().toUpperCase();

    if (current[upper]) {
      delete current[upper]; // Remove from favorites
    } else {
      // Add category and its workouts to favorites
      const allWorkouts = this.workoutsSignal();
      current[upper] = allWorkouts.filter(
        (w) => w.category.trim().toUpperCase() === upper
      );
    }

    this.favoriteCategoriesSignal.set(current);
    this.saveFavorites();
  }

  // Check if a category is in favorites
  isFavoriteCategory(category: string): boolean {
    return !!this.favoriteCategoriesSignal()[category.trim().toUpperCase()];
  }

  // Get all favorite categories
  get favoriteCategories() {
    return this.favoriteCategoriesSignal();
  }

  // Remove a specific category from favorites
  removeFavoriteCategory(category: string) {
    const current = { ...this.favoriteCategoriesSignal() };
    const upper = category.trim().toUpperCase();

    if (current[upper]) {
      delete current[upper];
      this.favoriteCategoriesSignal.set(current);
      this.saveFavorites();
    }
  }

  // Mark category as done (increments progress counter)
  markCategoryAsDone(category: string) {
    const upper = category.trim().toUpperCase();
    const current = { ...this.categoryProgressSignal() };

    // Initialize progress at 0 if category doesn’t exist
    if (!(upper in current)) current[upper] = 0;

    current[upper] += 1;
    this.categoryProgressSignal.set(current);
    this.saveProgress();
  }

  // Delete all workouts and data for a category
  deleteCategory(category: string) {
    const upper = category.trim().toUpperCase();

    // Remove workouts under this category
    const updatedWorkouts = this.workoutsSignal().filter(
      (w) => w.category.trim().toUpperCase() !== upper
    );
    this.workoutsSignal.set(updatedWorkouts);
    this.saveWorkouts();

    // Remove from favorites
    const currentFavs = { ...this.favoriteCategoriesSignal() };
    if (currentFavs[upper]) {
      delete currentFavs[upper];
      this.favoriteCategoriesSignal.set(currentFavs);
      this.saveFavorites();
    }

    // Reset progress for that category
    const currentProgress = { ...this.categoryProgressSignal() };
    currentProgress[upper] = 0;
    this.categoryProgressSignal.set(currentProgress);
    this.saveProgress();
  }

  // Get progress for all categories (ensures all defaults exist)
  getCategoryProgress(): { [category: string]: number } {
    const current = { ...this.categoryProgressSignal() };

    this.defaultCategories.forEach(cat => {
      const upper = cat.toUpperCase();
      if (!(upper in current)) {
        current[upper] = 0;
      }
    });

    return current;
  }

  // Get progress for a single category
  getProgressFor(category: string): number {
    const upper = category.trim().toUpperCase();
    return this.categoryProgressSignal()[upper] || 0;
  }
}
