import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth';
import { HomeComponent } from './pages/home/home';
import { WorkoutsComponent } from './pages/workouts/workouts';
import { CreatePlanComponent } from './pages/create/create';
import {ProfileComponent} from './pages/profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'home', component: HomeComponent },
  { path: 'workouts', component: WorkoutsComponent },
  { path: 'create', component: CreatePlanComponent },
  {path: 'profile', component: ProfileComponent},
];
