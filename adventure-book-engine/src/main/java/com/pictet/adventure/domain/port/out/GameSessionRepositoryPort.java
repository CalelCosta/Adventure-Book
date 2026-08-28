package com.pictet.adventure.domain.port.out;

import com.pictet.adventure.domain.model.GameSession;

import java.util.Optional;

public interface GameSessionRepositoryPort {
    GameSession save(GameSession session);
    Optional<GameSession> findById(String id);
}
