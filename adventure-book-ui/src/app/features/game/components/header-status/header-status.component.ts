import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header-status">
      <button class="btn-exit" (click)="exit.emit()">⬅ Back to Library</button>
      <h2 class="book-title">{{ bookTitle }}</h2>
      <div class="status-actions">
        <span class="health-display">❤️ {{ healthPoints }} HP</span>
        <button class="btn-save" (click)="save.emit()">💾 Save</button>
      </div>
    </header>
  `,
  styles: [
    `
      .header-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: #2c221e;
        color: #ffffff;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border-bottom: 3px solid #e2a82b;
      }
      .book-title {
        margin: 0;
        font-size: 1.25rem;
        font-family: Georgia, serif;
        color: #f1d592;
      }
      .status-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .health-display {
        font-weight: bold;
        color: #ff6b6b;
        font-size: 1.05rem;
      }
      .btn-exit,
      .btn-save {
        background: #e2a82b;
        border: none;
        color: #2c221e;
        padding: 0.4rem 0.85rem;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .btn-exit:hover,
      .btn-save:hover {
        background: #cb921f;
      }
    `,
  ],
})
export class HeaderStatusComponent {
  @Input() bookTitle: string = '';
  @Input() healthPoints: number = 10;

  @Output() exit = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
}
