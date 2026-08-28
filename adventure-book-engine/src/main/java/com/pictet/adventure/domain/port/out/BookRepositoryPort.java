package com.pictet.adventure.domain.port.out;

import com.pictet.adventure.domain.model.Book;

import java.util.List;
import java.util.Optional;

public interface BookRepositoryPort {
    Optional<Book> findById(String id);
    List<Book> findAll();
    void save(Book book);
}
