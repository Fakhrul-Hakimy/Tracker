import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DailyLog } from '../../models/pcos.models';
import { PcosDataService } from '../../services/pcos-data.service';

@Component({
  selector: 'app-daily-tracker',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './daily-tracker.component.html',
  styleUrl: './daily-tracker.component.scss'
})
export class DailyTrackerComponent implements OnInit {
  logs: DailyLog[] = [];
  statusMessage = '';

  form = this.fb.group({
    date: ['', Validators.required],
    medications: this.fb.array([this.createMedicationGroup()]),
    cycle: ['', Validators.required],
    symptoms: this.fb.group({
      energy: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      pelvicPain: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      bloating: [5, [Validators.required, Validators.min(1), Validators.max(10)]]
    }),
    pcosSigns: this.fb.group({
      acneBreakout: [false],
      hairChanges: [false]
    }),
    mood: ['', Validators.required],
    sleepHours: [7, [Validators.required, Validators.min(0), Validators.max(24)]],
    cravings: ['']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: PcosDataService
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  get medications(): FormArray {
    return this.form.get('medications') as FormArray;
  }

  addMedication(): void {
    this.medications.push(this.createMedicationGroup());
  }

  removeMedication(index: number): void {
    if (this.medications.length === 1) {
      return;
    }

    this.medications.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.statusMessage = 'Please complete required fields before saving.';
      return;
    }

    this.dataService.addLog(this.form.getRawValue() as DailyLog).subscribe({
      next: () => {
        this.statusMessage = 'Daily log saved successfully.';
        this.form.reset({
          date: '',
          cycle: '',
          mood: '',
          sleepHours: 7,
          cravings: '',
          symptoms: { energy: 5, pelvicPain: 5, bloating: 5 },
          pcosSigns: { acneBreakout: false, hairChanges: false }
        });

        while (this.medications.length > 1) {
          this.medications.removeAt(this.medications.length - 1);
        }

        this.medications.at(0).setValue({ name: '', dosage: '', taken: false });
        this.loadLogs();
      },
      error: () => {
        this.statusMessage = 'Unable to save daily log. Please try again.';
      }
    });
  }

  private loadLogs(): void {
    this.dataService.getLogs().subscribe((logs) => {
      this.logs = logs;
    });
  }

  private createMedicationGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      dosage: ['', Validators.required],
      taken: [false]
    });
  }
}
