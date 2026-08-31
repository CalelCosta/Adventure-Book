import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book, Section } from '../models/book.model';
import { map } from 'rxjs/operators';

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
      .get<any[]>(this.apiUrl)
      .pipe(
        map((books) =>
          books.map((book) => {
            let sections: Section[] = [];
            if (Array.isArray(book.sections)) {
              sections = book.sections;
            } else if (book.sections && typeof book.sections === 'object') {
              sections = Object.values(book.sections);
            }
            return {
              ...book,
              sections,
            } as Book;
          }),
        ),
      )
      .subscribe({
        next: (normalizedBooks) => {
          this.books.set(normalizedBooks);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching books from backend:', err);
          this.errorMessage.set('Failed to load books from server.');
          this.isLoading.set(false);
        },
      });
  }

  uploadBookJson(bookData: object) {
    return this.http.post<Book>(this.apiUrl, bookData);
  }
}
