import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutService } from '../../services/workoutService';
import { Workout } from '../../models/workout.model';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './workouts.html',
  styleUrl: './workouts.css',
})
export class WorkoutsComponent {
  // All workouts for the logged-in user
  workouts: Workout[] = [];

  // Workouts grouped by category
  groupedWorkouts: { [key: string]: Workout[] } = {};

  // Currently edited workout
  editingWorkout: Workout | null = null;

  // Editable fields for the workout being edited
  editedName = '';
  editedSets = 0;
  editedReps = 0;
  editedType: 'reps' | 'time' | 'distance' = 'reps';
  editedDuration = '';
  editedDistance = '';

  // Login state
  isLoggedIn = false;

  // Popup control flags
  showDeleteExercisePopup = false;
  showDeleteCategoryPopup = false;

  // Selected workout/category for deletion
  selectedExerciseId: number | null = null;
  selectedCategory: string | null = null;

  // Toast notification properties
  toastMessage = '';
  toastVisible = false;
  toastType: 'info' | 'success' | 'error' = 'info';

  constructor(
    private workoutService: WorkoutService,
    private router: Router,
  ) {}

  // On init, check login and load workouts
  ngOnInit() {
    const user = localStorage.getItem('currentUser');
    this.isLoggedIn = !!user;
    if (this.isLoggedIn) this.refreshWorkouts();
  }

  // Refresh the workout list and regroup them
  refreshWorkouts() {
    this.workouts = this.workoutService.workouts();
    this.groupWorkouts();
  }

  // Organize workouts by category
  groupWorkouts() {
    this.groupedWorkouts = {};
    for (const workout of this.workouts) {
      const category = workout.category.trim().toUpperCase();
      if (!this.groupedWorkouts[category]) {
        this.groupedWorkouts[category] = [];
      }
      this.groupedWorkouts[category].push(workout);
    }
  }

  // Get list of category names
  get categories(): string[] {
    return Object.keys(this.groupedWorkouts);
  }

  // Start editing a specific workout
  editWorkout(workout: Workout) {
    this.editingWorkout = { ...workout };
    this.editedName = workout.name;
    this.editedSets = workout.sets;
    this.editedReps = workout.reps ?? 0;
    this.editedType = workout.type ?? 'reps';
    this.editedDuration = workout.duration ?? '';
    this.editedDistance = workout.distance ?? '';
  }

  // Save edited workout changes
  saveEdit() {
    if (!this.editingWorkout) return;

    const updatedWorkout: Workout = {
      ...this.editingWorkout,
      name: this.editedName.trim(),
      sets: this.editedSets,
      type: this.editedType,
      reps: this.editedType === 'reps' ? this.editedReps : undefined,
      duration: this.editedType === 'time' ? this.editedDuration : undefined,
      distance: this.editedType === 'distance' ? this.editedDistance : undefined,
    };

    this.workoutService.updateWorkout(updatedWorkout);
    this.editingWorkout = null;
    this.refreshWorkouts();
  }

  // Cancel workout editing
  cancelEdit() {
    this.editingWorkout = null;
  }

  // Toggle a category as favorite/unfavorite
  toggleCategoryFavorite(category: string) {
    const wasFavorite = this.workoutService.isFavoriteCategory(category);
    this.workoutService.toggleFavoriteCategory(category, this.groupedWorkouts[category]);
    this.showToast(
      wasFavorite ? 'Removed from favorites ❤️‍🔥' : 'Added to favorites ❤️',
      wasFavorite ? 'error' : 'success',
    );
  }

  // Check if category is already favorite
  isCategoryFavorite(category: string): boolean {
    return this.workoutService.isFavoriteCategory(category);
  }

  // Open popup to confirm exercise deletion
  openDeleteExercisePopup(id: number) {
    this.selectedExerciseId = id;
    this.showDeleteExercisePopup = true;
  }

  // Confirm exercise deletion
  confirmDeleteExercise() {
    if (this.selectedExerciseId !== null) {
      this.workoutService.deleteWorkout(this.selectedExerciseId);
      this.refreshWorkouts();
    }
    this.cancelDeleteExercise();
  }

  // Cancel exercise deletion popup
  cancelDeleteExercise() {
    this.showDeleteExercisePopup = false;
    this.selectedExerciseId = null;
  }

  // Open popup to confirm category deletion
  openDeleteCategoryPopup(category: string) {
    this.selectedCategory = category;
    this.showDeleteCategoryPopup = true;
  }

  // Confirm category deletion
  confirmDeleteCategory() {
    if (this.selectedCategory) {
      this.workoutService.deleteCategory(this.selectedCategory);
      this.refreshWorkouts();
    }
    this.cancelDeleteCategory();
  }

  // Cancel category deletion popup
  cancelDeleteCategory() {
    this.showDeleteCategoryPopup = false;
    this.selectedCategory = null;
  }

  // Mark category as completed
  markCategoryAsDone(category: string) {
    this.workoutService.markCategoryAsDone(category);
    this.showToast(`Marked as done ✅`, 'success');
  }

  // Get progress value for a category
  getCategoryProgress(category: string) {
    return this.workoutService.getProgressFor(category);
  }

  // Show toast notification for quick feedback
  showToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 2000);
  }
}
