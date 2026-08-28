package com.pictet.adventure.application.validation;

import com.pictet.adventure.domain.model.Book;
import com.pictet.adventure.domain.model.enums.SectionType;
import org.springframework.stereotype.Component;

@Component
public class HasEndingRule implements BookValidationRule {

    @Override
    public void validate(Book book) {
        boolean hasEnding = book.sections().values().stream()
                .anyMatch(section -> section.type() == SectionType.END);

        if (!hasEnding) {
            throw new IllegalArgumentException(
                    "Invalid book '%s': Book has no ending".formatted(book.title())
            );
        }
    }
}
