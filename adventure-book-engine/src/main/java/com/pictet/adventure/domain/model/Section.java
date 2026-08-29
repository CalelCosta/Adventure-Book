package com.pictet.adventure.domain.model;

import com.pictet.adventure.domain.model.enums.SectionType;

import java.util.List;

public record Section(
        int id,
        SectionType type,
        String title,
        String text,
        List<Option> options
) {
    // Compact constructor to ensure options list is never null
    public Section {
        if (options == null) {
            options = List.of();
        }
    }

    public boolean isEndSection() {
        return type == SectionType.END;
    }
}
