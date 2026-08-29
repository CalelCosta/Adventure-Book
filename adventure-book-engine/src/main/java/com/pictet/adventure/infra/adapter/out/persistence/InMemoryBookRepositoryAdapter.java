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
public class InMemoryBookRepositoryAdapter implements BookRepositoryPort {
    private final Map<String, Book> storage = new ConcurrentHashMap<>();

    @Override
    public void save(Book book) {
        storage.put(book.id(), book);
    }

    @Override
    public Optional<Book> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<Book> findAll() {
        return new ArrayList<>(storage.values());
    }
}