package com.pictet.adventure.infra.adapter.out.file.mapper;

import com.pictet.adventure.domain.model.Book;
import com.pictet.adventure.domain.model.Consequence;
import com.pictet.adventure.domain.model.HealthConsequence;
import com.pictet.adventure.domain.model.Option;
import com.pictet.adventure.domain.model.Section;
import com.pictet.adventure.domain.model.enums.ConsequenceType;
import com.pictet.adventure.domain.model.enums.SectionType;
import com.pictet.adventure.infra.adapter.out.file.dto.BookJsonDto;
import com.pictet.adventure.infra.adapter.out.file.dto.ConsequenceJsonDto;
import com.pictet.adventure.infra.adapter.out.file.dto.OptionJsonDto;
import com.pictet.adventure.infra.adapter.out.file.dto.SectionJsonDto;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class BookDtoMapper {

    public Book toDomain(BookJsonDto dto) {
        String bookId = dto.id() != null && !dto.id().isBlank()
                ? dto.id()
                : UUID.randomUUID().toString();

        List<Section> sections = dto.sections() != null
                ? dto.sections().stream().map(this::mapSection).toList()
                : Collections.emptyList();

        return Book.create(
                bookId,
                dto.title(),
                dto.author(),
                sections
        );
    }

    private Section mapSection(SectionJsonDto dto) {
        SectionType type = dto.type() != null ? SectionType.valueOf(dto.type().toUpperCase()) : SectionType.NODE;

        List<Option> options = dto.options() != null
                ? dto.options().stream().map(this::mapOption).toList()
                : Collections.emptyList();

        return new Section(Integer.parseInt(dto.id()), type, dto.title(), dto.text(), options);
    }

    private Option mapOption(OptionJsonDto dto) {
        Consequence consequence = dto.consequence() != null ? mapConsequence(dto.consequence()) : null;
        return new Option(dto.description(), Integer.parseInt(dto.gotoId()),
                Optional.ofNullable(consequence), dto.requirement());
    }

    private Consequence mapConsequence(ConsequenceJsonDto dto) {
        ConsequenceType type = ConsequenceType.valueOf(dto.type().toUpperCase());
        int value = Optional.ofNullable(dto.value())
                .map(Integer::parseInt)
                .orElse(0);

        return switch (type) {
            case LOSE_HEALTH -> new HealthConsequence(dto.text() != null ? dto.text() : "You lost health.", -value);
            case GAIN_HEALTH -> new HealthConsequence(dto.text() != null ? dto.text() : "You gained health.", value);
        };
    }
}