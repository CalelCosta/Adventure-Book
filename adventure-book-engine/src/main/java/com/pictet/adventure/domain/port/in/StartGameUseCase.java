package com.pictet.adventure.domain.port.in;

import com.pictet.adventure.domain.model.GameSession;

public interface StartGameUseCase {
    GameSession execute(String bookId);
}
