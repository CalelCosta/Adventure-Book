package com.pictet.adventure.domain.port.in;

import com.pictet.adventure.domain.model.Book;

import java.util.List;

public interface ExploreBooksUseCase {
    List<Book> getAllBooks();
}
