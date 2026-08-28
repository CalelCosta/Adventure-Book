import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameService } from '../../core/services/game.service';
import { HeaderStatusComponent } from './components/header-status/header-status.component';
import { SectionReaderComponent } from './components/section-reader/section-reader.component';
import { GameOverModalComponent } from './components/game-over-modal/game-over-modal.component';

@Component({
  selector: 'app-game-view',
  standalone: true,
  imports: [CommonModule, HeaderStatusComponent, SectionReaderComponent, GameOverModalComponent],
  template: `
    <div class="game-container" *ngIf="currentBook() && activeSession(); else loadingTpl">
      <app-header-status
        [bookTitle]="currentBook()!.title"
        [healthPoints]="activeSession()!.player.healthPoints"
        (exit)="exitGame()"
      >
      </app-header-status>

      <main *ngIf="currentSection()">
        <app-section-reader [section]="currentSection()!" (makeChoice)="onMakeChoice($event)">
        </app-section-reader>
      </main>

      <app-game-over-modal
        *ngIf="isGameOver()"
        [isVictory]="isVictory()"
        [message]="gameOverMessage()"
        (restart)="restartGame()"
        (exit)="exitGame()"
      >
      </app-game-over-modal>
    </div>

    <ng-template #loadingTpl>
      <div class="loading">Carregando sessão...</div>
    </ng-template>
  `,
  styles: [
    `
      .game-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }
      .loading {
        text-align: center;
        padding: 4rem;
        color: #64748b;
      }
    `,
  ],
})
export class GameViewComponent {
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  activeSession = this.gameService.activeSession;
  currentBook = this.gameService.currentBook;
  isLoading = signal<boolean>(false);

  currentSection = computed(() => {
    const book = this.currentBook();
    const session = this.activeSession();
    if (!book || !session) return null;
    return book.sections.find((s) => s.id === session.currentSectionId) || null;
  });

  isVictory = computed(() => {
    const section = this.currentSection();
    const session = this.activeSession();
    return section?.type === 'END' && !!session?.player && !session.player.isDead;
  });

  isGameOver = computed(() => {
    const session = this.activeSession();
    const section = this.currentSection();
    if (!session) return false;
    return session.player.isDead || section?.type === 'END';
  });

  gameOverMessage = computed(() => {
    if (this.activeSession()?.player.isDead) {
      return 'Seus pontos de vida chegaram a zero. A jornada termina aqui.';
    }
    return 'Você alcançou o fim desta aventura com sucesso!';
  });

  onMakeChoice(nextSectionId: number): void {
    const session = this.activeSession();
    if (!session || this.isLoading()) return;

    this.isLoading.set(true);
    this.gameService.makeChoice(session.id, nextSectionId).subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false),
    });
  }

  restartGame(): void {
    const book = this.currentBook();
    if (book) {
      this.gameService.startGame(book).subscribe();
    }
  }

  exitGame(): void {
    this.gameService.clearSession();
    this.router.navigate(['/library']);
  }
}
