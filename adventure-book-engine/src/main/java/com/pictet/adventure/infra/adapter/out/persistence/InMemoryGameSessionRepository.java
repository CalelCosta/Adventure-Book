package com.pictet.adventure.infra.adapter.out.persistence;

import com.pictet.adventure.domain.model.GameSession;
import com.pictet.adventure.domain.port.out.GameSessionRepositoryPort;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryGameSessionRepository implements GameSessionRepositoryPort {
    private final Map<String, GameSession> sessions = new ConcurrentHashMap<>();

    @Override
    public GameSession save(GameSession session) {
        sessions.put(session.getId(), session);
        return session;
    }

    @Override
    public Optional<GameSession> findById(String id) {
        return Optional.ofNullable(sessions.get(id));
    }
}
