package com.pictet.adventure.infra.event;

public record SaveProgressEvent(String sessionId, int currentSectionId, int playerHp) {}