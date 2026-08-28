package com.pictet.adventure.application.validation;

import com.pictet.adventure.domain.model.Book;
import org.springframework.stereotype.Component;

@Component
public class NonEndingSectionOptionsRule implements BookValidationRule {

    @Override
    public void validate(Book book) {
        book.sections().values().stream()
                .filter(section -> !section.isEndSection())
                .forEach(section -> {
                    if (section.options() == null || section.options().isEmpty()) {
                        throw new IllegalArgumentException(
                                "Invalid book '%s': A non-ending section (ID: %d) has no options".formatted(book.title(), section.id())
                        );
                    }
                });
    }
}
