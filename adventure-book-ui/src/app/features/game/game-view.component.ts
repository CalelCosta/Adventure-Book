import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameService } from '../../core/services/game.service';
import { HeaderStatusComponent } from './components/header-status/header-status.component';
import { SectionReaderComponent } from './components/section-reader/section-reader.component';
import { GameOverModalComponent } from './components/game-over-modal/game-over-modal.component';
import { Option } from '../../core/models/book.model';

@Component({
  selector: 'app-game-view',
  standalone: true,
  imports: [CommonModule, HeaderStatusComponent, SectionReaderComponent, GameOverModalComponent],
  template: `
    @if (currentBook() && currentSection()) {
      <div class="game-container">
        <app-header-status
          [bookTitle]="currentBook()!.title"
          [healthPoints]="healthPoints()"
          (exit)="exitGame()"
          (save)="saveProgress()"
        >
        </app-header-status>

        <main>
          <app-section-reader [section]="currentSection()!" (makeChoice)="onMakeChoice($event)">
          </app-section-reader>
        </main>

        @if (isGameOver()) {
          <app-game-over-modal
            [isVictory]="isVictorious()"
            [message]="gameOverMessage()"
            (restart)="restartGame()"
            (exit)="exitGame()"
          >
          </app-game-over-modal>
        }
      </div>
    } @else {
      <div class="loading">Loading session...</div>
    }
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

  readonly currentBook = this.gameService.currentBook;
  readonly currentSection = this.gameService.currentSection;
  readonly healthPoints = this.gameService.health;
  readonly isGameOver = this.gameService.isGameOver;
  readonly isVictorious = this.gameService.isVictorious;

  gameOverMessage = computed(() => {
    if (this.healthPoints() <= 0) {
      return 'Your health points reached zero. Your journey ends here.';
    }
    return 'You have successfully reached the end of this adventure!';
  });

  onMakeChoice(choice: Option | number | string): void {
    this.gameService.makeChoice(choice);
  }

  saveProgress(): void {
    this.gameService.saveProgress();
  }

  restartGame(): void {
    const book = this.currentBook();
    if (book) {
      this.gameService.startGame(book);
    }
  }

  exitGame(): void {
    this.gameService.clearSession();
    this.router.navigate(['/library']);
  }
}
