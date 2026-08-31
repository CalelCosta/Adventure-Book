import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  readonly bookService = inject(BookService);
  private router = inject(Router);

  searchQuery = signal('');
  selectedCategory = signal('All');
  isUploadModalOpen = signal(false);
  uploadError = signal<string | null>(null);

  categories = ['All', 'Easy', 'Medium', 'Hard'];

  ngOnInit(): void {
    this.bookService.loadBooks();
  }

  filteredBooks = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory().toLowerCase();
    const allBooks = this.bookService.books();

    return allBooks.filter((book) => {
      const titleMatches = book.title?.toLowerCase().includes(query);
      const authorMatches = book.author?.toLowerCase().includes(query);
      const descMatches = this.getBookDescription(book).toLowerCase().includes(query);

      const matchesSearch = !query || titleMatches || authorMatches || descMatches;
      const matchesCategory =
        cat === 'all' || (book.difficulty && book.difficulty.toLowerCase() === cat);

      return matchesSearch && matchesCategory;
    });
  });

  getBookDescription(book: Book): string {
    if (book.description) return book.description;

    const sections = book.sections;
    if (!Array.isArray(sections)) {
      return 'Explore an interactive adventure filled with challenging paths and choices.';
    }

    const beginSection = sections.find((s) => s.type === 'BEGIN') || sections[0];
    return (
      beginSection?.text ??
      'Explore an interactive adventure filled with challenging paths and choices.'
    );
  }

  formatDifficulty(diff?: string): string {
    if (!diff) return 'Medium';
    return diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase();
  }

  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  startQuest(book: Book): void {
    this.router.navigate(['/game', book.id]);
  }

  openUploadModal(): void {
    this.uploadError.set(null);
    this.isUploadModalOpen.set(true);
  }

  closeUploadModal(): void {
    this.isUploadModalOpen.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonContent = JSON.parse(e.target?.result as string);
        this.bookService.uploadBookJson(jsonContent).subscribe({
          next: () => {
            this.bookService.loadBooks();
            this.closeUploadModal();
          },
          error: (err) => {
            console.error('Upload failed:', err);
            this.uploadError.set(err.error?.message || 'Invalid book structure.');
          },
        });
      } catch (err) {
        this.uploadError.set('Invalid JSON file format.');
      }
    };

    reader.readAsText(file);
  }
}
