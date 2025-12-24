import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NoteDto {
  id?: number;
  title?: string;
  description?: string;
  creationDate?: string;
  modifiedDate?: string;
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  private base = `${environment.apiBaseUrl}/notes`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<NoteDto[]> {
    return this.http.get<NoteDto[]>(this.base);
  }

  create(note: Partial<NoteDto>): Observable<NoteDto> {
    return this.http.post<NoteDto>(this.base, note);
  }
}
