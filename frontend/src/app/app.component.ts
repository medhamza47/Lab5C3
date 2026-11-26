import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { StudentFormComponent } from './student-form.component';
import { StudentListComponent } from './student-list.component';
import { Student, StudentInput, StudentService } from './student.service';

@Component({
  selector: 'app-root',
  imports: [StudentFormComponent, StudentListComponent],
  template: `<header><h1>EduManager</h1></header><main>
    @if (error(); as message) { <p role="alert">{{ message }}</p> }
    @if (busy()) { <p role="status">Chargement…</p> }
    @if (formOpen()) {
      <app-student-form [student]="selected()" [busy]="busy()" (saved)="save($event)"
        (cancelled)="formOpen.set(false)"/>
    } @else {
      <button type="button" (click)="openForm(null)" [disabled]="busy()">Ajouter</button>
    }
    <button type="button" (click)="load()" [disabled]="busy()">Actualiser</button>
    <app-student-list [students]="students()" [busy]="busy()" (edit)="openForm($event)" (remove)="remove($event)"/>
  </main>`,
})
export class AppComponent implements OnInit {
  private readonly service = inject(StudentService);
  readonly students = signal<Student[]>([]);
  readonly selected = signal<Student | null>(null);
  readonly formOpen = signal(false);
  readonly busy = signal(false);
  readonly error = signal('');

  ngOnInit(): void { this.load(); }

  load(): void {
    this.execute(this.service.getStudents(), students => this.students.set(students));
  }

  openForm(student: Student | null): void {
    this.selected.set(student);
    this.formOpen.set(true);
  }

  save(input: StudentInput): void {
    const selected = this.selected();
    const request = selected ? this.service.updateStudent(selected.id, input) : this.service.createStudent(input);
    this.execute(request, result => {
      this.students.update(students => selected
        ? students.map(student => student.id === result.id ? result : student)
        : [...students, result]);
      this.formOpen.set(false);
    });
  }

  remove(student: Student): void {
    if (!window.confirm(`Supprimer ${student.firstName} ${student.lastName} ?`)) return;
    this.execute(this.service.deleteStudent(student.id), () => {
      this.students.update(students => students.filter(entry => entry.id !== student.id));
      if (this.selected()?.id === student.id) this.formOpen.set(false);
    });
  }

  private execute<T>(request: Observable<T>, onSuccess: (result: T) => void): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    request.pipe(finalize(() => this.busy.set(false))).subscribe({
      next: onSuccess,
      error: (error: Error) => this.error.set(error.message),
    });
  }
}
