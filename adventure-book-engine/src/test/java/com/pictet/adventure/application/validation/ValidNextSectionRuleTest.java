package com.pictet.adventure.application.validation;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import com.pictet.adventure.domain.model.Book;
import com.pictet.adventure.domain.model.Option;
import com.pictet.adventure.domain.model.Section;
import com.pictet.adventure.domain.model.enums.SectionType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import java.util.List;
import java.util.Optional;

class ValidNextSectionRuleTest {

    private ValidNextSectionRule rule;

    @BeforeEach
    void setUp() {
        rule = new ValidNextSectionRule();
    }

    @Test
    @DisplayName("Should throw exception when option points to non-existent section ID")
    void shouldThrowExceptionWhenNextSectionIdIsInvalid() {
        Option invalidOption = new Option("Go to non-existent section", 999, Optional.empty(), "requirement");
        Section begin = new Section(1, SectionType.BEGIN, "Start","Start", List.of(invalidOption));
        Book book = Book.create("1", "Broken Links Book", "Author", List.of(begin));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> rule.validate(book)
        );

        assertTrue(exception.getMessage().contains("invalid next section id (999)"));
    }
}