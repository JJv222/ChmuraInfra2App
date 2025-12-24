import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MediaDto {
  id?: number;
  title?: string;
  description?: string;
  creationDate?: string;
  modifiedDate?: string;
  filename?: string;
  contentType?: string;
}

@Injectable({ providedIn: 'root' })
export class MediaService {
  base = `${environment.apiBaseUrl}/media`;
  postPhoto(id: number){return  `${this.base}/photo/${id}`;}
  constructor(private http: HttpClient) {}

  getAll(): Observable<MediaDto[]> {
    return this.http.get<MediaDto[]>(this.base);
  }

  
upload(formData: FormData): Observable<MediaDto> {
  const title = formData.get('title');
  const description = formData.get('description');
  const media: MediaDto = {description: description ? String(description) : undefined,
                           title: title ? String(title) : undefined};

  return this.http.post<number>(this.base, media).pipe(
     switchMap((created) => {
      const photoID = Number(created);
      const file = formData.get('file');
      if (!(file instanceof File)) {
        return throwError(() => new Error('Brak pliku w FormData pod kluczem "file".'));
      }
      const fileFd = new FormData();
      fileFd.set('file', file);
      return this.http.post<MediaDto>(this.postPhoto(photoID), fileFd);
    })
  );
}

  // Fetch raw media bytes as a Blob. Assumes backend exposes an endpoint like
  // GET /api/media/{id}/data which returns the binary with appropriate content-type.
  // If your backend uses a different path, adjust accordingly.
  getMediaData(id: number): Observable<Blob> {
    // Backend exposes GET /api/media/{id}/download which returns the binary bytes
    const url = `${this.base}/${id}/download`;
    // Angular's HttpClient with { responseType: 'blob' } returns Observable<Blob>
    return this.http.get(url, { responseType: 'blob' }) as Observable<Blob>;
  }
}
