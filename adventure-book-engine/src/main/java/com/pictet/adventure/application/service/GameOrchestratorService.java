package com.pictet.adventure.application.service;

import com.pictet.adventure.domain.model.*;
import com.pictet.adventure.domain.model.enums.SectionType;
import com.pictet.adventure.domain.port.in.MakeChoiceUseCase;
import com.pictet.adventure.domain.port.in.StartGameUseCase;
import com.pictet.adventure.domain.port.out.BookRepositoryPort;
import com.pictet.adventure.domain.port.out.GameSessionRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameOrchestratorService implements StartGameUseCase, MakeChoiceUseCase {

    private final BookRepositoryPort bookRepository;
    private final GameSessionRepositoryPort sessionRepository;

    @Override
    public GameSession execute(String bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found: " + bookId));

        // Objective 2: Start a game requires finding the unique BEGIN section
        Section startingSection = book.sections().values().stream()
                .filter(section -> section.type() == SectionType.BEGIN)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Book has no BEGIN section. Validation failed."));

        GameSession session = GameSession.builder()
                .id(UUID.randomUUID().toString())
                .bookId(bookId)
                .currentSectionId(startingSection.id())
                // The Player is automatically instantiated with 10 HP by the GameSession builder
                .build();

        log.info("Started new game session {} for book {}", session.getId(), book.title());
        return sessionRepository.save(session);
    }

    @Override
    public GameSession execute(String sessionId, int optionGotoId) {
        GameSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        if (session.getPlayer().isDead()) {
            throw new IllegalStateException("Game Over. The player is already dead.");
        }

        Book book = bookRepository.findById(session.getBookId())
                .orElseThrow(() -> new IllegalStateException("Book data missing for active session."));

        Section currentSection = book.getSection(session.getCurrentSectionId())
                .orElseThrow(() -> new IllegalStateException("Current section not found in book."));

        // Validate if the chosen option exists in the current section
        Option chosenOption = currentSection.options().stream()
                .filter(opt -> opt.gotoId() == optionGotoId)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid option chosen for current section."));

        // Objective 3: Handle consequences mechanism
        chosenOption.consequence().ifPresent(consequence -> applyConsequence(session.getPlayer(), consequence));

        // Once health reaches zero, the player dies, and the adventure is over
        if (!session.getPlayer().isDead()) {
            session.moveToSection(chosenOption.gotoId());
        }

        return sessionRepository.save(session);
    }

    private void applyConsequence(Player player, Consequence consequence) {
        switch (consequence) {
            case HealthConsequence hc -> {
                log.info("Applying health consequence: {}", hc.hpChangeValue());
                player.applyHealthModifier(hc.hpChangeValue());
            }
            case ItemConsequence ic -> {
                log.info("Applying item consequence: gain item {}", ic.itemId());
            }
        }
    }
}
