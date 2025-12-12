// User model interface defines the structure of a user object
export interface User {
  // Basic user credentials
  username: string;   // the user's display name
  email: string;      // used for login and identification
  password: string;   // user's password

  // Optional personal info section
  about?: {
    name?: string;      // user's first name
    surname?: string;   // user's last name
    age?: number;       // user's age in years
    weight?: number;    // user's weight in kilograms
    height?: number;    // user's height in centimeters
  };

  // Optional list of favorite workouts
  favorites?: {
    workoutId: number;     // unique workout ID
    timesFinished: number; // how many times the workout was completed
  }[];
}
