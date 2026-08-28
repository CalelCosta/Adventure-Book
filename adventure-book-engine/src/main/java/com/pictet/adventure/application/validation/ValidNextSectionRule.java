package com.pictet.adventure.application.validation;

import com.pictet.adventure.domain.model.Book;
import org.springframework.stereotype.Component;

@Component
public class ValidNextSectionRule implements BookValidationRule {

    @Override
    public void validate(Book book) {
        book.sections().values().forEach(section -> {
            section.options().forEach(option -> {
                if (!book.sections().containsKey(option.gotoId())) {
                    throw new IllegalArgumentException(
                            "Invalid book '%s': Book has invalid next section id (%d) in section %d"
                                    .formatted(book.title(), option.gotoId(), section.id())
                    );
                }
            });
        });
    }
}
