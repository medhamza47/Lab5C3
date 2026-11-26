import { Component, input, output } from '@angular/core';
import { Student } from './student.service';

@Component({
  selector: 'app-student-list',
  template: `<ul class="grid">
    @for (student of students(); track student.id) {
      <li class="card"><strong>{{ student.firstName }} {{ student.lastName }}</strong>
        <p>{{ student.major }} · {{ student.email }}</p>
        <button type="button" (click)="edit.emit(student)" [disabled]="busy()">Modifier</button>
        <button type="button" (click)="remove.emit(student)" [disabled]="busy()">Supprimer</button>
      </li>
    } @empty { <li>Aucun étudiant inscrit.</li> }
  </ul>`,
})
export class StudentListComponent {
  readonly students = input.required<Student[]>();
  readonly busy = input.required<boolean>();
  readonly edit = output<Student>();
  readonly remove = output<Student>();
}
