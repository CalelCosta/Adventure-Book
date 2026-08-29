package com.pictet.adventure.application.service;

import com.pictet.adventure.domain.model.Book;
import com.pictet.adventure.domain.port.in.ExploreBooksUseCase;
import com.pictet.adventure.domain.port.out.BookRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookQueryService implements ExploreBooksUseCase {

    private final BookRepositoryPort bookRepository;

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
}