package com.pictet.adventure.infra.adapter.in.web;

import com.pictet.adventure.domain.model.GameSession;
import com.pictet.adventure.domain.port.in.MakeChoiceUseCase;
import com.pictet.adventure.domain.port.in.StartGameUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/games")
@RequiredArgsConstructor
public class GameController {

    private final StartGameUseCase startGameUseCase;
    private final MakeChoiceUseCase makeChoiceUseCase;

    @PostMapping("/start")
    public ResponseEntity<GameSession> startGame(@RequestBody Map<String, String> request) {
        String bookId = request.get("bookId");
        GameSession session = startGameUseCase.execute(bookId);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/{sessionId}/choice")
    public ResponseEntity<GameSession> makeChoice(
            @PathVariable String sessionId,
            @RequestBody Map<String, Integer> request) {

        Integer optionGotoId = request.get("optionGotoId");
        GameSession session = makeChoiceUseCase.execute(sessionId, optionGotoId);
        return ResponseEntity.ok(session);
    }
}
