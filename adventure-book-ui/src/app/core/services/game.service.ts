import { Injectable, signal, computed, inject } from '@angular/core';
import { Book, Section, Option, GameState } from '../models/book.model';
import { BookService } from './book.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private bookService = inject(BookService);

  readonly currentBook = signal<Book | null>(null);
  readonly currentSectionId = signal<number | string>(1);
  readonly health = signal<number>(10);
  readonly maxHealth = 10;
  readonly lastConsequenceText = signal<string | null>(null);

  readonly activeSession = computed(() => {
    const book = this.currentBook();
    if (!book) return null;
    return {
      id: String(book.id || book.title),
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
    return book.sections.find((s) => String(s.id) === String(this.currentSectionId())) || null;
  });

  readonly isGameOver = computed(() => {
    const section = this.currentSection();
    return this.health() <= 0 || section?.type === 'END';
  });

  readonly isVictorious = computed(() => {
    const section = this.currentSection();
    return section?.type === 'END' && this.health() > 0;
  });

  startGame(book: Book): void {
    this.currentBook.set(book);
    const beginSection = book.sections.find((s) => s.type === 'BEGIN') || book.sections[0];
    this.currentSectionId.set(beginSection ? beginSection.id : 1);
    this.health.set(10);
    this.lastConsequenceText.set(null);
  }

  makeChoice(target: Option | number | string): void {
    if (this.health() <= 0) return;

    let nextId: number | string;

    if (typeof target === 'object' && target !== null && 'gotoId' in target) {
      const option = target as Option;
      if (option.consequence) {
        const { type, value, text } = option.consequence;
        this.lastConsequenceText.set(text || null);
        const numVal = Number(value) || 0;
        if (type === 'LOSE_HEALTH') {
          this.health.update((hp) => Math.max(0, hp - numVal));
        } else if (type === 'GAIN_HEALTH') {
          this.health.update((hp) => Math.min(this.maxHealth, hp + numVal));
        }
      } else {
        this.lastConsequenceText.set(null);
      }
      nextId = option.gotoId;
    } else {
      nextId = target as number | string;
    }

    if (this.health() > 0) {
      this.currentSectionId.set(nextId);
    }
  }

  saveProgress(): void {
    const book = this.currentBook();
    if (!book) return;

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
        this.currentBook.set(book);
        this.currentSectionId.set(state.currentSectionId);
        this.health.set(state.health);
        if (state.lastConsequenceMessage) {
          this.lastConsequenceText.set(state.lastConsequenceMessage);
        }
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
    this.currentSectionId.set(1);
    this.health.set(10);
    this.lastConsequenceText.set(null);
  }
}
