package com.pictet.adventure.infra.adapter.out.persistence;

import com.pictet.adventure.domain.model.Book;
import com.pictet.adventure.domain.port.out.BookRepositoryPort;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryBookRepository implements BookRepositoryPort {
    private final Map<String, Book> books = new ConcurrentHashMap<>();

    @Override
    public Optional<Book> findById(String id) {
        return Optional.ofNullable(books.get(id));
    }

    @Override
    public List<Book> findAll() {
        return new ArrayList<>(books.values());
    }

    @Override
    public void save(Book book) {
        books.put(book.id(), book);
    }
}
