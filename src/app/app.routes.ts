import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DailyTrackerComponent } from './components/daily-tracker/daily-tracker.component';
import { GlossaryComponent } from './components/glossary/glossary.component';
import { AppointmentComponent } from './components/appointment/appointment.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'daily', component: DailyTrackerComponent },
  { path: 'glossary', component: GlossaryComponent },
  { path: 'appointments', component: AppointmentComponent },
  { path: '**', redirectTo: '' }
];
