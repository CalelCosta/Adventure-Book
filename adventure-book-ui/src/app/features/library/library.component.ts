import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { GameService } from '../../core/services/game.service';
import { Book } from '../../core/models/book.model';
import { BookCardComponent } from './components/book-card/book-card.component';
import { BookUploadComponent } from './components/book-upload/book-upload.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent, BookUploadComponent],
  template: `
    <div class="library-container">
      <header class="library-header">
        <div>
          <h1>Biblioteca de Aventuras</h1>
          <p>Escolha um livro para jogar ou faça o upload de uma nova história em formato JSON.</p>
        </div>
        <button class="btn-add" (click)="showUploadModal.set(true)">+ Novo Livro</button>
      </header>

      <div class="search-bar">
        <input
          type="text"
          placeholder="Buscar livro por título ou autor..."
          [(ngModel)]="searchQuery"
        />
      </div>

      @if (!isLoading()) {
        <div class="books-grid">
          @for (book of filteredBooks(); track book.id) {
            <app-book-card [book]="book" (onStart)="startGame($event)"></app-book-card>
          } @empty {
            <div class="empty-state">
              <p>Nenhum livro encontrado.</p>
            </div>
          }
        </div>
      } @else {
        <div class="loading">Carregando histórias...</div>
      }

      @if (showUploadModal()) {
        <app-book-upload (close)="showUploadModal.set(false)" (upload)="handleFileUpload($event)">
        </app-book-upload>
      }
    </div>
  `,
  styles: [
    `
      .library-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }
      .library-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }
      .library-header h1 {
        font-size: 2rem;
        color: #0f172a;
        margin: 0;
      }
      .library-header p {
        color: #64748b;
        margin: 0.5rem 0 0 0;
      }
      .btn-add {
        background-color: #0f172a;
        color: white;
        border: none;
        padding: 0.75rem 1.25rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }
      .search-bar input {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        margin-bottom: 2rem;
        font-size: 1rem;
      }
      .books-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      .loading,
      .empty-state {
        text-align: center;
        padding: 3rem;
        color: #64748b;
      }
    `,
  ],
})
export class LibraryComponent implements OnInit {
  private readonly bookService = inject(BookService);
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  books = signal<Book[]>([]);
  isLoading = signal<boolean>(true);
  showUploadModal = signal<boolean>(false);
  searchQuery = signal<string>('');

  filteredBooks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.books().filter(
      (b) => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query),
    );
  });

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading.set(true);
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  startGame(book: Book): void {
    this.gameService.startGame(book).subscribe({
      next: () => this.router.navigate(['/game']),
    });
  }

  handleFileUpload(file: File): void {
    this.bookService.uploadBook(file).subscribe({
      next: () => {
        this.showUploadModal.set(false);
        this.loadBooks();
      },
    });
  }
}
