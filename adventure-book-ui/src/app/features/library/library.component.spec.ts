import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryComponent } from './library.component';
import { BookService } from '../../core/services/book.service';
import { GameService } from '../../core/services/game.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  let bookServiceMock: any;
  let gameServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Mocks completos com signals
    bookServiceMock = {
      loadBooks: vi.fn(),
      books: signal([]),
      isLoading: signal(false),
      errorMessage: signal(null),
      uploadBookJson: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
    };

    gameServiceMock = {
      startGame: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LibraryComponent, FormsModule],
      providers: [
        { provide: BookService, useValue: bookServiceMock },
        { provide: GameService, useValue: gameServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load books on init', () => {
    expect(bookServiceMock.loadBooks).toHaveBeenCalled();
  });

  it('should filter books by search term', () => {
    bookServiceMock.books = signal([
      { id: '1', title: 'Dragon', author: 'A', sections: [], difficulty: 'EASY' },
      { id: '2', title: 'Space', author: 'B', sections: [], difficulty: 'HARD' },
    ]);
    component.searchQuery.set('dragon');
    fixture.detectChanges();
    expect(component.filteredBooks().length).toBe(1);
    expect(component.filteredBooks()[0].title).toContain('Dragon');
  });

  it('should filter by category', () => {
    bookServiceMock.books = signal([
      { id: '1', title: 'Dragon', author: 'A', sections: [], difficulty: 'EASY' },
      { id: '2', title: 'Space', author: 'B', sections: [], difficulty: 'HARD' },
    ]);
    component.selectedCategory.set('Hard');
    fixture.detectChanges();
    expect(component.filteredBooks().length).toBe(1);
    expect(component.filteredBooks()[0].title).toBe('Space');
  });
});
