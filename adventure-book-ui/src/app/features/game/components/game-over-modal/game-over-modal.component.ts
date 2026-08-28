import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-over-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-card" [class.victory]="isVictory">
        <div class="icon">{{ isVictory ? '🏆' : '💀' }}</div>
        <h2>{{ isVictory ? 'Vitória!' : 'Fim de Jogo' }}</h2>
        <p>{{ message }}</p>

        <div class="actions">
          <button class="btn-restart" (click)="restart.emit()">Tentar Novamente</button>
          <button class="btn-library" (click)="exit.emit()">Voltar à Biblioteca</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
      }
      .modal-card {
        background: white;
        border-radius: 16px;
        padding: 2.5rem;
        text-align: center;
        width: 90%;
        max-width: 440px;
      }
      .icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }
      h2 {
        font-size: 2rem;
        color: #0f172a;
        margin: 0 0 0.5rem 0;
      }
      p {
        color: #64748b;
        margin-bottom: 2rem;
        line-height: 1.5;
      }
      .actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .btn-restart {
        background: #2563eb;
        color: white;
        border: none;
        padding: 0.875rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }
      .btn-library {
        background: transparent;
        border: 1px solid #cbd5e1;
        color: #475569;
        padding: 0.875rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }
    `,
  ],
})
export class GameOverModalComponent {
  @Input({ required: true }) isVictory!: boolean;
  @Input({ required: true }) message!: string;
  @Output() restart = new EventEmitter<void>();
  @Output() exit = new EventEmitter<void>();
}
