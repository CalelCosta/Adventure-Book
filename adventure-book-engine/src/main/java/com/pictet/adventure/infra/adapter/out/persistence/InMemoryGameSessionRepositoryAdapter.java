package com.pictet.adventure.infra.adapter.out.persistence;

import com.pictet.adventure.domain.model.GameSession;
import com.pictet.adventure.domain.port.out.GameSessionRepositoryPort;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryGameSessionRepositoryAdapter implements GameSessionRepositoryPort {
    private final Map<String, GameSession> storage = new ConcurrentHashMap<>();

    @Override
    public GameSession save(GameSession session) {
        storage.put(session.getId(), session);
        return session;
    }

    @Override
    public Optional<GameSession> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }
}