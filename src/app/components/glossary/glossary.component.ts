import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { GlossaryTerm } from '../../models/pcos.models';
import { PcosDataService } from '../../services/pcos-data.service';
import { GlossarySearchPipe } from '../../pipes/glossary-search.pipe';

@Component({
  selector: 'app-glossary',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, GlossarySearchPipe],
  templateUrl: './glossary.component.html',
  styleUrl: './glossary.component.scss'
})
export class GlossaryComponent implements OnInit {
  searchQuery = '';
  terms: GlossaryTerm[] = [];
  statusMessage = '';

  form = this.fb.group({
    term: ['', Validators.required],
    definition: ['', Validators.required],
    userNotes: ['']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: PcosDataService
  ) {}

  ngOnInit(): void {
    this.loadTerms();
  }

  saveTerm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: GlossaryTerm = {
      id: 0,
      term: this.form.controls.term.value ?? '',
      definition: this.form.controls.definition.value ?? '',
      userNotes: this.form.controls.userNotes.value ?? ''
    };

    this.dataService.addTerm(payload).subscribe({
      next: () => {
        this.statusMessage = 'Term added.';
        this.form.reset({ term: '', definition: '', userNotes: '' });
        this.loadTerms();
      },
      error: () => {
        this.statusMessage = 'Unable to save term.';
      }
    });
  }

  private loadTerms(): void {
    this.dataService.getTerms().subscribe((terms) => {
      this.terms = terms;
    });
  }
}
