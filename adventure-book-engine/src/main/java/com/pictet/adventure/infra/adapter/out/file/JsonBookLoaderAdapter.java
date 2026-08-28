package com.pictet.adventure.infra.adapter.out.file;

import com.pictet.adventure.application.validation.BookValidatorUseCase;
import com.pictet.adventure.domain.model.*;
import com.pictet.adventure.domain.model.enums.ConsequenceType;
import com.pictet.adventure.domain.model.enums.SectionType;
import com.pictet.adventure.domain.port.out.BookRepositoryPort;
import com.pictet.adventure.infra.adapter.out.file.dto.BookJsonDto;
import com.pictet.adventure.infra.adapter.out.file.dto.ConsequenceJsonDto;
import com.pictet.adventure.infra.adapter.out.file.dto.OptionJsonDto;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class JsonBookLoaderAdapter {

    private final ObjectMapper objectMapper;
    private final BookRepositoryPort bookRepository;
    private final BookValidatorUseCase bookValidator;

    // Loads all JSON files from the resources/books directory
    @Value("classpath:books/*.json")
    private Resource[] bookResources;

    @PostConstruct
    public void loadBooksOnStartup() {
        log.info("Starting to load adventure books from JSON files...");
        for (Resource resource : bookResources) {
            try {
                if (resource.contentLength() == 0) {
                    log.warn("Skipping empty file: {}", resource.getFilename());
                    continue;
                }

                BookJsonDto dto = objectMapper.readValue(resource.getInputStream(), BookJsonDto.class);
                Book book = mapToDomain(dto);

                // Objective 1: Validate the book before saving
                bookValidator.validateBook(book);
                bookRepository.save(book);

                log.info("Successfully loaded and validated book: '{}'", book.title());
            } catch (IllegalArgumentException e) {
                log.warn("Book validation failed for file {}: {}", resource.getFilename(), e.getMessage());
            } catch (Exception e) {
                log.error("Failed to parse book from file {}: {}", resource.getFilename(), e.getMessage());
            }
        }
    }

    private Book mapToDomain(BookJsonDto dto) {
        String bookId = UUID.randomUUID().toString(); // Generate unique ID since JSON doesn't provide one

        List<Section> sections = dto.sections().stream().map(secDto -> {
            List<Option> options = secDto.options() == null ? List.of() : secDto.options().stream()
                    .map(this::mapOption)
                    .collect(Collectors.toList());

            return new Section(secDto.id(), SectionType.valueOf(secDto.type()), secDto.text(), options);
        }).collect(Collectors.toList());

        return Book.create(bookId, dto.title(), dto.author(), sections);
    }

    private Option mapOption(OptionJsonDto optDto) {
        Optional<Consequence> consequence = Optional.empty();
        if (optDto.consequence() != null) {
            consequence = Optional.of(mapConsequence(optDto.consequence()));
        }
        return new Option(optDto.description(), optDto.gotoId(), consequence);
    }

    private Consequence mapConsequence(ConsequenceJsonDto consDto) {
        if (ConsequenceType.LOSE_HEALTH.name().equals(consDto.type())) {
            int hpLoss = Integer.parseInt(consDto.value()) * -1;
            return new HealthConsequence("You lost health points.", hpLoss);
        }

        if (ConsequenceType.GAIN_HEALTH.name().equals(consDto.type())) {
            int hpGain = Integer.parseInt(consDto.value());
            return new HealthConsequence("You gained health points.", hpGain);
        }

        throw new IllegalArgumentException("Unknown consequence type: " + consDto.type());
    }
}
