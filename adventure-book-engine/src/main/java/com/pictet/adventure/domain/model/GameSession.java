package com.pictet.adventure.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

/**
 * Represents an active game instance for a user[cite: 1].
 */
@Getter
@Builder
public class GameSession {
    private final String id;
    private final String bookId;

    @Builder.Default
    private final Player player = new Player();

    private int currentSectionId;

    @Builder.Default
    private final Instant startedAt = Instant.now();

    @Builder.Default
    private Instant lastSavedAt = Instant.now();

    public void moveToSection(int nextSectionId) {
        if (player.isDead()) {
            throw new IllegalStateException("Cannot move. Player is dead.");
        }
        this.currentSectionId = nextSectionId;
        this.lastSavedAt = Instant.now();
    }
}
