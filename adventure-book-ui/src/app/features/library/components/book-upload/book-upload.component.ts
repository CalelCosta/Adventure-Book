import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3>Upload de Nova História (JSON)</h3>
        <p>
          Selecione um arquivo de livro no formato JSON estruturado para validar e adicionar à
          biblioteca.
        </p>

        <div class="file-dropzone" (dragover)="$event.preventDefault()" (drop)="onFileDrop($event)">
          <input type="file" accept=".json" #fileInput (change)="onFileSelected($event)" hidden />
          <button class="btn-secondary" (click)="fileInput.click()">Escolher Arquivo JSON</button>
          @if (selectedFile()) {
            <span>{{ selectedFile()?.name }}</span>
          }
        </div>

        <div class="actions">
          <button class="btn-cancel" (click)="close.emit()">Cancelar</button>
          <button class="btn-upload" [disabled]="!selectedFile()" (click)="submit()">
            Enviar Livro
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .modal-content {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        width: 90%;
        max-width: 480px;
      }
      .file-dropzone {
        border: 2px dashed #cbd5e1;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        margin: 1.5rem 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
      }
      .btn-cancel {
        background: transparent;
        border: 1px solid #cbd5e1;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
      }
      .btn-upload {
        background: #10b981;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      }
      .btn-upload:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class BookUploadComponent {
  @Output() close = new EventEmitter<void>();
  @Output() upload = new EventEmitter<File>();

  selectedFile = signal<File | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile.set(input.files[0]);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.selectedFile.set(event.dataTransfer.files[0]);
    }
  }

  submit(): void {
    if (this.selectedFile()) {
      this.upload.emit(this.selectedFile()!);
    }
  }
}
