import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../../core/models/book.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <span class="badge">{{ book.sections.length }} seções</span>
        <h3>{{ book.title }}</h3>
        <p class="author">Por {{ book.author }}</p>
      </div>
      <div class="card-body">
        <p>
          Explore esta aventura interativa tomando decisões que afetam diretamente o seu destino e
          sua vida.
        </p>
      </div>
      <div class="card-footer">
        <button class="btn-primary" (click)="onStart.emit(book)">Iniciar Aventura</button>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition:
          transform 0.2s,
          box-shadow 0.2s;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
      }

      .badge {
        display: inline-block;
        background-color: #e0e7ff;
        color: #3730a3;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.25rem 0.6rem;
        border-radius: 9999px;
        margin-bottom: 0.5rem;
      }

      h3 {
        font-size: 1.25rem;
        color: #1e293b;
        margin: 0 0 0.25rem 0;
      }

      .author {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0 0 1rem 0;
      }

      .card-body p {
        font-size: 0.9rem;
        color: #475569;
        line-height: 1.5;
        margin-bottom: 1.5rem;
      }

      .btn-primary {
        width: 100%;
        background-color: #2563eb;
        color: white;
        border: none;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: #1d4ed8;
        }
      }
    `,
  ],
})
export class BookCardComponent {
  @Input({ required: true }) book!: Book;
  @Output() onStart = new EventEmitter<Book>();
}
