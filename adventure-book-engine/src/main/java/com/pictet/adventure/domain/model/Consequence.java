package com.pictet.adventure.domain.model;

public sealed interface Consequence permits HealthConsequence, ItemConsequence {
    String text();
}