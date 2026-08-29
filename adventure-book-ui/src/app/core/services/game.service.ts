import { Injectable, signal, computed, inject } from '@angular/core';
import { Book, Section, Option, GameState } from '../models/book.model';
import { BookService } from './book.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/games';
  private bookService = inject(BookService);

  // Signals
  readonly currentBook = signal<Book | null>(null);
  readonly sessionId = signal<string | null>(null);
  readonly currentSectionId = signal<number | string>(1);
  readonly health = signal<number>(10);
  readonly maxHealth = 10;
  readonly lastConsequenceText = signal<string | null>(null);
  readonly isLoading = signal<boolean>(false); // <-- NOVO

  readonly activeSession = computed(() => {
    const book = this.currentBook();
    const sid = this.sessionId();
    if (!book || !sid) return null;
    return {
      id: sid,
      bookId: String(book.id || book.title),
      currentSectionId: this.currentSectionId(),
      player: {
        healthPoints: this.health(),
        isDead: this.health() <= 0,
      },
    };
  });

  readonly currentSection = computed<Section | null>(() => {
    const book = this.currentBook();
    if (!book) return null;
    const sections = book.sections;
    if (!Array.isArray(sections) || sections.length === 0) {
      console.warn('Book has no sections:', book);
      return null;
    }
    const found = sections.find((s) => String(s.id) === String(this.currentSectionId()));
    console.log('currentSection computed:', found);
    return found || null;
  });

  readonly isGameOver = computed(() => {
    const section = this.currentSection();
    return this.health() <= 0 || section?.type === 'END';
  });

  readonly isVictorious = computed(() => {
    const section = this.currentSection();
    return section?.type === 'END' && this.health() > 0;
  });

  // Methods
  startGame(book: Book): void {
    this.isLoading.set(true);
    const bookId = String(book.id || book.title);
    console.log('Starting game with bookId:', bookId, 'Book:', book);

    // Verifica se o livro tem seções
    if (!Array.isArray(book.sections) || book.sections.length === 0) {
      console.error('Book has no sections. Cannot start game.', book);
      this.isLoading.set(false);
      return;
    }

    this.http.post<any>(`${this.apiUrl}/start`, { bookId }).subscribe({
      next: (session) => {
        console.log('Session response:', session);
        this.currentBook.set(book);
        this.sessionId.set(session.id);
        this.currentSectionId.set(session.currentSectionId);
        this.health.set(session.player?.healthPoints ?? 10);
        this.lastConsequenceText.set(null);
        this.isLoading.set(false);
        console.log('Current section after set:', this.currentSection());
      },
      error: (err) => {
        console.error('Error starting game session on backend:', err);
        this.isLoading.set(false);
      },
    });
  }

  makeChoice(target: Option | number | string): void {
    const sid = this.sessionId();
    if (!sid || this.health() <= 0) return;

    let optionGotoId: number;

    if (typeof target === 'object' && target !== null && 'gotoId' in target) {
      const option = target as Option;
      optionGotoId = Number(option.gotoId);
      if (option.consequence?.text) {
        this.lastConsequenceText.set(option.consequence.text);
      } else {
        this.lastConsequenceText.set(null);
      }
    } else {
      optionGotoId = Number(target);
      this.lastConsequenceText.set(null);
    }

    this.http.post<any>(`${this.apiUrl}/${sid}/choice`, { optionGotoId }).subscribe({
      next: (session) => {
        this.currentSectionId.set(session.currentSectionId);
        if (session.player && typeof session.player.healthPoints === 'number') {
          this.health.set(session.player.healthPoints);
        }
      },
      error: (err) => {
        console.error('Error processing choice on backend:', err);
      },
    });
  }

  saveProgress(): void {
    const book = this.currentBook();
    const sid = this.sessionId();
    if (!book || !sid) return;

    const state: GameState = {
      bookId: String(book.id || book.title),
      currentSectionId: this.currentSectionId(),
      health: this.health(),
      maxHealth: this.maxHealth,
      isGameOver: this.isGameOver(),
      isVictorious: this.isVictorious(),
      lastConsequenceMessage: this.lastConsequenceText() || undefined,
    };
    localStorage.setItem(`adventure_save_${state.bookId}`, JSON.stringify(state));
  }

  loadSessionFromLocalStorage(): boolean {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('adventure_save_'));
    if (keys.length === 0) return false;

    const key = keys[0];
    const raw = localStorage.getItem(key);
    if (!raw) return false;

    try {
      const state: GameState = JSON.parse(raw);
      const book = this.bookService.books().find((b) => String(b.id || b.title) === state.bookId);
      if (book) {
        this.startGame(book);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error restoring session:', e);
      return false;
    }
  }

  clearSession(): void {
    this.currentBook.set(null);
    this.sessionId.set(null);
    this.currentSectionId.set(1);
    this.health.set(10);
    this.lastConsequenceText.set(null);
    this.isLoading.set(false);
  }
}
