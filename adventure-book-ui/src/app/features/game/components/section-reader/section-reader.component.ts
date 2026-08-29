import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Section, Option } from '../../../../core/models/book.model';

@Component({
  selector: 'app-section-reader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="reader-card">
      <div class="section-badge">Section #{{ section.id }}</div>

      <div class="section-text">
        <p>{{ section.text }}</p>
      </div>

      @if (section.options && section.options.length > 0) {
        <div class="choices-container">
          <h3>What will you do?</h3>
          <div class="options-list">
            @for (option of section.options; track option.gotoId) {
              <button class="choice-btn" (click)="makeChoice.emit(option)">
                <span class="choice-text">{{ option.description }}</span>
                @if (option.consequence) {
                  <span
                    class="consequence-tag"
                    [class.damage]="option.consequence.type === 'LOSE_HEALTH'"
                  >
                    {{ option.consequence.type === 'LOSE_HEALTH' ? '-' : '+'
                    }}{{ option.consequence.value }} HP
                  </span>
                }
              </button>
            }
          </div>
        </div>
      }
    </article>
  `,
  styles: [
    `
      .reader-card {
        background: #ffffff;
        border-radius: 12px;
        padding: 2.5rem;
        border: 1px solid #e2e8f0;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      }
      .section-badge {
        display: inline-block;
        color: #64748b;
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1rem;
      }
      .section-text p {
        font-size: 1.125rem;
        line-height: 1.8;
        color: #1e293b;
        white-space: pre-line;
        margin-bottom: 2.5rem;
      }
      .choices-container h3 {
        font-size: 1rem;
        color: #475569;
        margin-bottom: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .options-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .choice-btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        text-align: left;
        padding: 1rem 1.25rem;
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        color: #0f172a;
        transition: all 0.2s;
        &:hover {
          background: #e2e8f0;
          border-color: #94a3b8;
          transform: translateX(4px);
        }
      }
      .consequence-tag {
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        background: #dcfce7;
        color: #15803d;
        &.damage {
          background: #fee2e2;
          color: #b91c1c;
        }
      }
    `,
  ],
})
export class SectionReaderComponent {
  @Input({ required: true }) section!: Section;
  @Output() makeChoice = new EventEmitter<Option>();
}
