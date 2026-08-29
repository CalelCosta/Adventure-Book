package com.pictet.adventure.infra.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class GameProgressEventListener {

    @Async
    @EventListener
    public void handleSaveProgress(SaveProgressEvent event) {
        log.info("[Async Virtual Thread] Checkpoint saved for Session: {} | Section: {} | HP: {}",
                event.sessionId(), event.currentSectionId(), event.playerHp());
    }
}