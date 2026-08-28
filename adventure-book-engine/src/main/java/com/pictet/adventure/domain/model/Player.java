package com.pictet.adventure.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Player {
    private static final int INITIAL_HEALTH = 10;

    private int healthPoints;

    public Player() {
        this.healthPoints = INITIAL_HEALTH; // A player starts with 10 health points
    }

    public void applyHealthModifier(int modifier) {
        this.healthPoints += modifier;
        if (this.healthPoints < 0) {
            this.healthPoints = 0;
        }
        if (this.healthPoints > INITIAL_HEALTH) {
            this.healthPoints = INITIAL_HEALTH;
        }
    }

    public boolean isDead() {
        return this.healthPoints <= 0; // Once health reaches zero, the player dies
    }
}
