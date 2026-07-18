import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appointment } from '../../models/pcos.models';
import { PcosDataService } from '../../services/pcos-data.service';

@Component({
  selector: 'app-appointment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss'
})
export class AppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  statusMessage = '';

  form = this.fb.group({
    id: [0],
    date: ['', Validators.required],
    doctorName: ['', Validators.required],
    questions: this.fb.array([this.fb.control('', Validators.required)]),
    labResults: this.fb.array([this.createLabResultGroup()])
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: PcosDataService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  get labResults(): FormArray {
    return this.form.get('labResults') as FormArray;
  }

  get upcomingAppointments(): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments
      .filter((appointment) => appointment.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  addQuestion(): void {
    this.questions.push(this.fb.control('', Validators.required));
  }

  removeQuestion(index: number): void {
    if (this.questions.length === 1) {
      return;
    }

    this.questions.removeAt(index);
  }

  addLabResult(): void {
    this.labResults.push(this.createLabResultGroup());
  }

  removeLabResult(index: number): void {
    if (this.labResults.length === 1) {
      return;
    }

    this.labResults.removeAt(index);
  }

  saveAppointment(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.statusMessage = 'Please fill required fields before saving.';
      return;
    }

    this.dataService.addAppointment(this.form.getRawValue() as Appointment).subscribe({
      next: () => {
        this.statusMessage = 'Appointment saved.';
        this.form.reset({ id: 0, date: '', doctorName: '' });

        while (this.questions.length > 1) {
          this.questions.removeAt(this.questions.length - 1);
        }

        while (this.labResults.length > 1) {
          this.labResults.removeAt(this.labResults.length - 1);
        }

        this.questions.at(0).setValue('');
        this.labResults.at(0).setValue({ testName: '', currentValue: '', previousValue: '' });
        this.loadAppointments();
      },
      error: () => {
        this.statusMessage = 'Unable to save appointment.';
      }
    });
  }

  private loadAppointments(): void {
    this.dataService.getAppointments().subscribe((appointments) => {
      this.appointments = appointments;
    });
  }

  private createLabResultGroup() {
    return this.fb.group({
      testName: ['', Validators.required],
      currentValue: ['', Validators.required],
      previousValue: ['', Validators.required]
    });
  }
}
