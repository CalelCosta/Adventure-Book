import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GameSession, StartGameRequest, MakeChoiceRequest } from '../models/game-session.model';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/games';

  readonly activeSession = signal<GameSession | null>(null);
  readonly currentBook = signal<Book | null>(null);

  startGame(book: Book): Observable<GameSession> {
    const body: StartGameRequest = { bookId: book.id };
    return this.http.post<GameSession>(`${this.apiUrl}/start`, body).pipe(
      tap((session) => {
        this.currentBook.set(book);
        this.activeSession.set(session);
        this.saveSessionToLocalStorage(session, book);
      }),
    );
  }

  makeChoice(sessionId: string, nextSectionId: number): Observable<GameSession> {
    const body: MakeChoiceRequest = { nextSectionId };
    return this.http.post<GameSession>(`${this.apiUrl}/${sessionId}/choice`, body).pipe(
      tap((updatedSession) => {
        this.activeSession.set(updatedSession);
        if (this.currentBook()) {
          this.saveSessionToLocalStorage(updatedSession, this.currentBook()!);
        }
      }),
    );
  }

  clearSession(): void {
    this.activeSession.set(null);
    this.currentBook.set(null);
    localStorage.removeItem('adventure_active_session');
    localStorage.removeItem('adventure_active_book');
  }

  private saveSessionToLocalStorage(session: GameSession, book: Book): void {
    localStorage.setItem('adventure_active_session', JSON.stringify(session));
    localStorage.setItem('adventure_active_book', JSON.stringify(book));
  }

  loadSessionFromLocalStorage(): boolean {
    const savedSession = localStorage.getItem('adventure_active_session');
    const savedBook = localStorage.getItem('adventure_active_book');

    if (savedSession && savedBook) {
      this.activeSession.set(JSON.parse(savedSession));
      this.currentBook.set(JSON.parse(savedBook));
      return true;
    }
    return false;
  }
}
