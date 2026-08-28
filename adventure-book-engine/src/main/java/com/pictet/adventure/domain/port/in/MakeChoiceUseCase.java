package com.pictet.adventure.domain.port.in;

import com.pictet.adventure.domain.model.GameSession;

public interface MakeChoiceUseCase {
    GameSession execute(String sessionId, int optionGotoId);
}
