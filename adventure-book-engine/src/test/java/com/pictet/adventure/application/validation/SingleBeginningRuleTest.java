package com.pictet.adventure.application.validation;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import com.pictet.adventure.domain.model.Book;
import com.pictet.adventure.domain.model.Section;
import com.pictet.adventure.domain.model.enums.SectionType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import java.util.List;

class SingleBeginningRuleTest {

    private SingleBeginningRule rule;

    @BeforeEach
    void setUp() {
        rule = new SingleBeginningRule();
    }

    @Test
    @DisplayName("Should pass when book has exactly one BEGIN section")
    void shouldPassWhenBookHasSingleBeginning() {
        Section begin = new Section(1, SectionType.BEGIN, "title","Start", List.of());
        Section end = new Section(2, SectionType.END, "title","The End", List.of());
        Book book = Book.create("1", "Valid Book", "Author", "MEDIUM", List.of(begin, end));

        assertDoesNotThrow(() -> rule.validate(book));
    }

    @Test
    @DisplayName("Should throw exception when book has no BEGIN section")
    void shouldThrowExceptionWhenBookHasNoBeginning() {
        Section node = new Section(1, SectionType.NODE, "title","Middle", List.of());
        Section end = new Section(2, SectionType.END, "title","The End", List.of());
        Book book = Book.create("1", "No Begin Book", "Author", "HARD", List.of(node, end));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> rule.validate(book)
        );

        assertTrue(exception.getMessage().contains("none, or more than one beginning"));
    }

    @Test
    @DisplayName("Should throw exception when book has multiple BEGIN sections")
    void shouldThrowExceptionWhenBookHasMultipleBeginnings() {
        Section begin1 = new Section(1, SectionType.BEGIN, "title","Start 1", List.of());
        Section begin2 = new Section(2, SectionType.BEGIN, "title","Start 2", List.of());
        Book book = Book.create("1", "Multi Begin Book", "Author", "EASY", List.of(begin1, begin2));

        assertThrows(IllegalArgumentException.class, () -> rule.validate(book));
    }
}