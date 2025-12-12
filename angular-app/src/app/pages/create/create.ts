import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../services/workoutService';
import { Workout } from '../../models/workout.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
})
export class CreatePlanComponent {
  // Object used to store data from the form
  newWorkout: Partial<Workout> = { type: 'reps', category: 'Push' };

  // Messages for success or error feedback
  message = '';
  error = '';

  // Valid workout categories
  validCategories = ['Push', 'Pull', 'Legs', 'Core', 'Full Body', 'Cardio'];

  constructor(private workoutService: WorkoutService, private router: Router) {}

  // Automatically formats exercise names (capitalizes each word)
  formatExerciseName(name: string): string {
    return name
      .split(' ')
      .map(word =>
        word
          .split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join('-')
      )
      .join(' ');
  }

  // Checks if the exercise name is valid (must include at least one letter)
  isValidExerciseName(name: string): boolean {
    const regex = /[a-zA-Z]/; // must contain at least one letter
    return regex.test(name);
  }

  // Main function triggered when submitting the form
  addWorkout() {
    this.error = '';
    this.message = '';

    // Extract workout properties
    let { name, category, sets, reps, duration, distance, type } = this.newWorkout;

    // Required field validation
    if (!name?.trim() || !category || !sets || !type) {
      this.error = '⚠️ Please fill all required fields.';
      setTimeout(() => (this.error = ''), 3000);
      return;
    }

    name = name.trim();

    // Validate exercise name content
    if (!this.isValidExerciseName(name)) {
      this.error = '⚠️ Exercise name must contain at least one letter.';
      setTimeout(() => (this.error = ''), 3000);
      return;
    }

    // Apply auto-formatting (capitalize)
    name = this.formatExerciseName(name);

    // Get current workouts from service signal
    const workouts = this.workoutService.workouts();

    // Prevent duplicate exercises in the same category
    const existing = workouts.find(
      (w: Workout) =>
        w.category.trim().toLowerCase() === category!.trim().toLowerCase() &&
        w.name.trim().toLowerCase() === name.toLowerCase()
    );

    if (existing) {
      this.error = `⚠️ "${name}" already exists in "${category}" category.`;
      setTimeout(() => (this.error = ''), 3000);
      return;
    }

    // Type-specific validations
    if (type === 'reps' && (!reps || +reps < 1)) {
      this.error = '⚠️ Please enter valid repetitions.';
      setTimeout(() => (this.error = ''), 3000);
      return;
    }

    if (type === 'time' && (!duration || +duration < 1)) {
      this.error = '⚠️ Please enter a valid duration (in minutes).';
      setTimeout(() => (this.error = ''), 3000);
      return;
    }

    if (type === 'distance' && (!distance || +distance <= 0)) {
      this.error = '⚠️ Please enter a valid distance (in km).';
      setTimeout(() => (this.error = ''), 3000);
      return;
    }

    // Create the final workout object
    const workout: Workout = {
      id: Date.now(),
      name,
      category,
      sets: +sets,
      type,
      reps: type === 'reps' ? +reps! : undefined,
      duration: type === 'time' ? duration!.toString() : undefined,
      distance: type === 'distance' ? distance!.toString() : undefined,
    };

    // Save the workout via service
    this.workoutService.addWorkout(workout);

    // Show success message
    this.message = `✅ ${workout.name} added to "${category}"!`;

    // Reset form values
    this.newWorkout = { type: 'reps', category: 'Push' };

    // Auto-hide message after 3 seconds
    setTimeout(() => (this.message = ''), 3000);
  }
}
