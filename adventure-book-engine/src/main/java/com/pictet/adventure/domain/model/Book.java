package com.pictet.adventure.domain.model;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * The Book acts as an Aggregate Root for the story.
 */
public record Book(
        String id,
        String title,
        String author,
        Map<Integer, Section> sections // Mapped by section ID for O(1) fast lookups
) {

    // Factory method to create a Book from a List of sections
    public static Book create(String id, String title, String author, List<Section> sectionList) {
        Map<Integer, Section> sectionMap = sectionList.stream()
                .collect(Collectors.toMap(Section::id, Function.identity()));

        return new Book(id, title, author, sectionMap);
    }

    public Optional<Section> getSection(int sectionId) {
        return Optional.ofNullable(sections.get(sectionId));
    }
}
