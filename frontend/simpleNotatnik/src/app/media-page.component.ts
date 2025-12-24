import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MediaService, MediaDto } from './services/media.service';
import { formatShort } from './utils/date.util';

@Component({
  selector: 'media-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="card">
        <h2>Media</h2>

        <form (submit)="upload($event)" class="form-row" style="margin-bottom:12px">
          <input class="input input--grow" type="text" placeholder="Title" [(ngModel)]="title" name="title" />
          <input class="input input--grow" type="text" placeholder="Description" [(ngModel)]="description" name="description" />
          <input class="input" type="file" (change)="onFile($event)" />
          <button class="btn" type="submit">Upload</button>
        </form>

        <section *ngIf="items().length === 0">No media yet</section>

        <ul class="list">
          <li *ngFor="let m of items()" class="item-card">
            <div class="info">
              <div class="title">{{ m.title || m.filename }}</div>
              <div class="desc">{{ m.description }}</div>
              <div class="meta">Created: {{ formatShort(m.creationDate) }} • Modified: {{ formatShort(m.modifiedDate) }}</div>
            </div>
            <div *ngIf="m.id && mediaUrls[m.id]" class="thumb">
              <img [src]="mediaUrls[m.id]" [alt]="m.title || m.filename" style="width:100%;height:auto;border-radius:8px" />
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
    export class MediaPage implements OnInit, OnDestroy {
      items = signal<MediaDto[]>([]);
      // map id -> object URL for display
      mediaUrls: Record<number, string> = {};
      selectedFile?: File | null = null;
      title = '';
      description = '';
      // expose helper to template
      readonly formatShort = formatShort;

      constructor(private service: MediaService) {}

      ngOnInit(): void {
        this.load();
      }

      ngOnDestroy(): void {
        this.revokeAllUrls();
      }

      private revokeAllUrls() {
        for (const k of Object.keys(this.mediaUrls)) {
          try {
            URL.revokeObjectURL(this.mediaUrls[+k]);
          } catch (e) {
            // ignore
          }
        }
        this.mediaUrls = {};
      }

      load() {
        // revoke previous urls to avoid leaks
        this.revokeAllUrls();
        this.service.getAll().subscribe(data => {
          const items = data || [];
          this.items.set(items);

          // for each media that looks like an image, fetch the binary and create an object URL
          for (const m of items) {
            if (m.id && m.contentType && m.contentType.startsWith('image/')) {
              // fetch blob and create object URL
              this.service.getMediaData(m.id).subscribe({
                next: blob => {
                  try {
                    this.mediaUrls[m.id as number] = URL.createObjectURL(blob);
                  } catch (e) {
                    // ignore
                  }
                },
                error: () => {
                  // ignore fetch errors for individual items
                }
              });
            }
          }
        });
      }

      onFile(event: Event) {
        const input = event.target as HTMLInputElement;
        this.selectedFile = input.files && input.files.length > 0 ? input.files[0] : null;
      }

      upload(ev: Event) {
        ev.preventDefault();
        if (!this.selectedFile) {
          alert('Please select a file');
          return;
        }
        const fd = new FormData();
        fd.append('file', this.selectedFile, this.selectedFile.name);
        if (this.title) fd.append('title', this.title);
        if (this.description) fd.append('description', this.description);

        this.service.upload(fd).subscribe(() => {
          this.title = '';
          this.description = '';
          this.selectedFile = null;
          this.load();
        });
      }
    }
