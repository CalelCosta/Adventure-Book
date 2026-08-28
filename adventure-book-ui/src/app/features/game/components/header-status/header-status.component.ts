import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="game-header">
      <div class="book-info">
        <button class="btn-exit" (click)="exit.emit()">← Voltar à Biblioteca</button>
        <h2>{{ bookTitle }}</h2>
      </div>

      <div class="player-status">
        <div class="hp-badge" [class.low-hp]="healthPoints <= 3">
          <span class="heart-icon">❤️</span>
          <span class="hp-text">{{ healthPoints }} HP</span>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: #0f172a;
        color: white;
        border-radius: 12px;
        margin-bottom: 2rem;
      }
      .book-info {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      .book-info h2 {
        font-size: 1.25rem;
        margin: 0;
        font-weight: 600;
        color: #f8fafc;
      }
      .btn-exit {
        background: transparent;
        border: 1px solid #334155;
        color: #94a3b8;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.2s;
        &:hover {
          background: #1e293b;
          color: white;
        }
      }
      .hp-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #1e293b;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        border: 1px solid #334155;
        font-weight: 700;
        color: #ef4444;
      }
      .hp-badge.low-hp {
        animation: pulse 1.5s infinite;
        border-color: #ef4444;
      }
      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
    `,
  ],
})
export class HeaderStatusComponent {
  @Input({ required: true }) bookTitle!: string;
  @Input({ required: true }) healthPoints!: number;
  @Output() exit = new EventEmitter<void>();
}
