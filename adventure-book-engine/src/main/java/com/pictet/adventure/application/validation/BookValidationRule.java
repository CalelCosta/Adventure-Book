package com.pictet.adventure.application.validation;

import com.pictet.adventure.domain.model.Book;

public interface BookValidationRule {
    void validate(Book book);
}
