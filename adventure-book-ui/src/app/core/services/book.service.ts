import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/books';

  readonly books = signal<Book[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  loadBooks(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http
      .get<Book[]>(this.apiUrl)
      .pipe(
        // Normaliza os dados: garante que sections seja sempre um array
        map((books) =>
          books.map((book) => ({
            ...book,
            sections: Array.isArray(book.sections) ? book.sections : [],
            // Opcional: garante que outros campos opcionais tenham valores padrão
            description: book.description || '',
            tags: Array.isArray(book.tags) ? book.tags : [],
          })),
        ),
      )
      .subscribe({
        next: (normalizedBooks) => {
          this.books.set(normalizedBooks);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching books from backend:', err);
          this.errorMessage.set(
            'Failed to load books from server. Please check backend connection.',
          );
          this.isLoading.set(false);
        },
      });
  }

  uploadBookJson(bookData: object): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, bookData);
  }
}
