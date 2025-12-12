// Workout model interface defines the structure of a workout object
export interface Workout {
  id: number;              // unique identifier for each workout
  name: string;            // name of the exercise
  category: string;        // category name
  sets: number;            // number of sets to perform

  // Optional workout details depending on type
  reps?: number;                        // number of repetitions
  type?: 'reps' | 'time' | 'distance';  // defines type of workout
  duration?: string;                    // duration of the workout
  distance?: string;                    // distance covered

  // Progress tracking
  doneCount?: number;      // how many times this workout has been completed
}
