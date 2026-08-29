import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = '/api/books';

  readonly books = signal<Book[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  loadBooks(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http.get<Book[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.books.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching books from backend:', err);
        this.errorMessage.set('Failed to load books from server. Please check backend connection.');
        this.isLoading.set(false);
      },
    });
  }

  uploadBookJson(bookData: object) {
    return this.http.post<Book>(this.apiUrl, bookData);
  }
}
