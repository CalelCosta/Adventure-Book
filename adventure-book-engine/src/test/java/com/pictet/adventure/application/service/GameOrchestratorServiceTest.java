package com.pictet.adventure.application.service;

import com.pictet.adventure.domain.model.*;
import com.pictet.adventure.domain.model.enums.SectionType;
import com.pictet.adventure.domain.port.out.BookRepositoryPort;
import com.pictet.adventure.domain.port.out.GameSessionRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GameOrchestratorServiceTest {

    @Mock
    private BookRepositoryPort bookRepository;

    @Mock
    private GameSessionRepositoryPort sessionRepository;

    @InjectMocks
    private GameOrchestratorService gameOrchestrator;

    private Book mockBook;

    @BeforeEach
    void setUp() {
        Option optToNode = new Option("Go forward", 2, Optional.empty(), "requirement");

        // Option with -6 HP consequence[cite: 1]
        HealthConsequence damageCons = new HealthConsequence("Trap!", -6);
        Option optWithDamage = new Option("Touch crystal", 3, Optional.of(damageCons), "requirement");

        Section begin = new Section(1, SectionType.BEGIN, "Cave","Cave Entrance", List.of(optToNode, optWithDamage));
        Section node = new Section(2, SectionType.NODE, "Tunnel","Tunnel", List.of());
        Section end = new Section(3, SectionType.END, "Trapped Room","Trapped Room", List.of());

        mockBook = Book.create("book-123", "Crystal Caverns", "Author", List.of(begin, node, end));
    }

    @Test
    @DisplayName("Should start new game session with 10 HP at BEGIN section")
    void shouldStartGameSuccessfully() {
        when(bookRepository.findById("book-123")).thenReturn(Optional.of(mockBook));
        when(sessionRepository.save(any(GameSession.class))).thenAnswer(inv -> inv.getArgument(0));

        GameSession session = gameOrchestrator.execute("book-123");

        assertNotNull(session);
        assertEquals(10, session.getPlayer().getHealthPoints());
        assertEquals(1, session.getCurrentSectionId());
        verify(sessionRepository, times(1)).save(any(GameSession.class));
    }

    @Test
    @DisplayName("Should apply health consequence and move section upon choice")
    void shouldApplyDamageAndMoveSection() {
        GameSession activeSession = GameSession.builder()
                .id("session-1")
                .bookId("book-123")
                .currentSectionId(1)
                .build();

        when(sessionRepository.findById("session-1")).thenReturn(Optional.of(activeSession));
        when(bookRepository.findById("book-123")).thenReturn(Optional.of(mockBook));
        when(sessionRepository.save(any(GameSession.class))).thenAnswer(inv -> inv.getArgument(0));

        // Choose option pointing to section 3 (which applies -6 HP)[cite: 1]
        GameSession updatedSession = gameOrchestrator.execute("session-1", 3);

        assertEquals(4, updatedSession.getPlayer().getHealthPoints()); // 10 - 6 = 4 HP[cite: 1]
        assertFalse(updatedSession.getPlayer().isDead());
    }

    @Test
    @DisplayName("Should handle player death when HP reaches 0")
    void shouldKillPlayerWhenHealthReachesZero() {
        // Player starts with 5 HP
        Player injuredPlayer = new Player(5);
        GameSession activeSession = GameSession.builder()
                .id("session-1")
                .bookId("book-123")
                .player(injuredPlayer)
                .currentSectionId(1)
                .build();

        when(sessionRepository.findById("session-1")).thenReturn(Optional.of(activeSession));
        when(bookRepository.findById("book-123")).thenReturn(Optional.of(mockBook));
        when(sessionRepository.save(any(GameSession.class))).thenAnswer(inv -> inv.getArgument(0));

        // Choose option with -6 HP (5 - 6 = -1, capped at 0)
        GameSession updatedSession = gameOrchestrator.execute("session-1", 3);

        assertEquals(0, updatedSession.getPlayer().getHealthPoints());
        assertTrue(updatedSession.getPlayer().isDead());
    }
}