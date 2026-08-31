import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { GameService } from './game.service';
import { BookService } from './book.service';
import { Book } from '../models/book.model';
import { signal } from '@angular/core';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;
  let bookServiceMock: Partial<BookService>;

  const mockBook: Book = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    sections: [{ id: 1, text: 'Start', type: 'BEGIN', options: [] }],
  };

  beforeEach(() => {
    bookServiceMock = {
      books: signal([mockBook]),
    };

    TestBed.configureTestingModule({
      providers: [
        GameService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BookService, useValue: bookServiceMock },
      ],
    });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should start a game and update state', () => {
    const sessionResponse = {
      id: 'session123',
      currentSectionId: 1,
      player: { healthPoints: 10 },
    };

    service.startGame(mockBook);
    const req = httpMock.expectOne('http://localhost:8080/api/v1/games/start');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ bookId: '1' });
    req.flush(sessionResponse);

    expect(service.currentBook()).toEqual(mockBook);
    expect(service.sessionId()).toBe('session123');
    expect(service.currentSectionId()).toBe(1);
    expect(service.health()).toBe(10);
    expect(service.isLoading()).toBe(false);
  });
});
