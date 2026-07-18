import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PcosDataService } from '../../services/pcos-data.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  totalLogs = 0;
  totalTerms = 0;
  upcomingAppointments = 0;

  constructor(private readonly dataService: PcosDataService) {}

  ngOnInit(): void {
    this.dataService.getLogs().subscribe((logs) => (this.totalLogs = logs.length));
    this.dataService.getTerms().subscribe((terms) => (this.totalTerms = terms.length));
    this.dataService
      .getAppointments()
      .subscribe(
        (appointments) =>
          (this.upcomingAppointments = appointments.filter((appt) => appt.date >= this.today()).length)
      );
  }

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }
}
