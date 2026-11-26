import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Student, StudentInput } from './student.service';

const empty: StudentInput = { firstName: '', lastName: '', email: '', major: '' };

@Component({
  selector: 'app-student-form',
  imports: [ReactiveFormsModule],
  template: `<h2>{{ student() ? 'Modifier' : 'Ajouter' }} un étudiant</h2>
  <form [formGroup]="form" (ngSubmit)="submit()">
    <label>Prénom <input formControlName="firstName"></label>
    <label>Nom <input formControlName="lastName"></label>
    <label>E-mail <input type="email" formControlName="email"></label>
    <label>Filière <input formControlName="major"></label>
    <button [disabled]="form.invalid || busy()">Enregistrer</button>
    <button type="button" (click)="cancelled.emit()" [disabled]="busy()">Annuler</button>
  </form>`,
})
export class StudentFormComponent {
  readonly student = input<Student | null>(null);
  readonly busy = input(false);
  readonly saved = output<StudentInput>();
  readonly cancelled = output<void>();
  private readonly builder = inject(FormBuilder).nonNullable;
  readonly form = this.builder.group({
    firstName: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
    lastName: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
    email: ['', [Validators.required, Validators.email]],
    major: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
  });

  constructor() {
    effect(() => this.form.reset(this.student() ?? empty));
  }

  submit(): void {
    if (this.form.valid && !this.busy()) this.saved.emit(this.form.getRawValue());
  }
}
