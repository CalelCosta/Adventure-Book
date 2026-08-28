package com.pictet.adventure.domain.model;

/**
 * Represents a consequence that affects the player's health.
 * For example, if a player loses 6 HP, the modifier will be -6.
 */
public record HealthConsequence(String text, int hpChangeValue) implements Consequence {}