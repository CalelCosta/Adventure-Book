package com.pictet.adventure.domain.model;

import java.util.Optional;

public record Option(
        String description,
        int gotoId,
        Optional<Consequence> consequence
) {
    public Option {
        // Validation constraint: an option must always point to a valid section id
        if (gotoId < 0) {
            throw new IllegalArgumentException("gotoId must be a positive value.");
        }
    }
}
