import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesService, NoteDto } from './services/notes.service';
import { formatShort } from './utils/date.util';

@Component({
  selector: 'notes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="card">
        <h2>Notes</h2>

        <form (ngSubmit)="add()" class="form-row" style="margin-bottom:12px">
          <input class="input input--grow" placeholder="Title" [(ngModel)]="title" name="title" required />
          <input class="input input--grow" placeholder="Description" [(ngModel)]="description" name="description" />
          <button class="btn" type="submit">Add note</button>
        </form>

        <section *ngIf="notes().length === 0">No notes yet</section>

        <ul class="list">
          <li *ngFor="let n of notes()" class="item-card">
            <div class="info">
              <div class="title">{{ n.title }}</div>
              <div class="desc">{{ n.description }}</div>
              <div class="meta">Created: {{ formatShort(n.creationDate) }} • Modified: {{ formatShort(n.modifiedDate) }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class NotesPage implements OnInit {
  notes = signal<NoteDto[]>([]);
  title = '';
  description = '';
  // expose helper to template
  readonly formatShort = formatShort;

  constructor(private service: NotesService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(data => this.notes.set(data || []));
  }

  add() {
    const payload = { title: this.title, description: this.description };
    this.service.create(payload).subscribe(() => {
      this.title = '';
      this.description = '';
      this.load();
    });
  }
}
