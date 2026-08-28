package com.pictet.adventure.application.validation;

import com.pictet.adventure.domain.model.Book;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookValidatorUseCase {

    // Spring injects all implemented rules automatically
    private final List<BookValidationRule> validationRules;

    public void validateBook(Book book) {
        log.info("Starting validation for book: {}", book.title());

        for (BookValidationRule rule : validationRules) {
            rule.validate(book);
        }

        log.info("Book '{}' successfully passed all {} validation rules.", book.title(), validationRules.size());
    }
}
