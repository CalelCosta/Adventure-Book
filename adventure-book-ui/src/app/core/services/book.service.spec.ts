import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { BookService } from './book.service';
import { Book } from '../models/book.model';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load books and update signal', () => {
    const mockBooks: Book[] = [{ id: '1', title: 'Book 1', author: 'Author 1', sections: [] }];

    service.loadBooks();
    const req = httpMock.expectOne('http://localhost:8080/api/v1/books');
    expect(req.request.method).toBe('GET');
    req.flush(mockBooks);

    expect(service.books()).toEqual(mockBooks);
    expect(service.isLoading()).toBe(false);
    expect(service.errorMessage()).toBeNull();
  });

  it('should handle error when loading books fails', () => {
    service.loadBooks();
    const req = httpMock.expectOne('http://localhost:8080/api/v1/books');
    req.error(new ProgressEvent('Network error'));

    expect(service.isLoading()).toBe(false);
    expect(service.errorMessage()).toContain('Failed to load books');
  });
});
