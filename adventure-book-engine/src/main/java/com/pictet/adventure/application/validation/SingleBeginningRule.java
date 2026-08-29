package com.pictet.adventure.application.validation;

import com.pictet.adventure.domain.model.Book;
import com.pictet.adventure.domain.model.enums.SectionType;
import org.springframework.stereotype.Component;

@Component
public class SingleBeginningRule implements BookValidationRule {

    @Override
    public void validate(Book book) {
        long beginningCount = book.sections().values().stream()
                .filter(section -> section.type() == SectionType.BEGIN)
                .count();

        if (beginningCount != 1) {
            throw new IllegalArgumentException(
                    "Invalid book '%s': Book has none, or more than one beginning. Found: %d"
                            .formatted(book.title(), beginningCount)
            );
        }
    }
}