package com.pictet.adventure.infra.adapter.out.file;

import com.pictet.adventure.application.validation.BookValidatorUseCase;
import com.pictet.adventure.domain.model.Book;
import com.pictet.adventure.domain.port.out.BookRepositoryPort;
import com.pictet.adventure.infra.adapter.out.file.dto.BookJsonDto;
import com.pictet.adventure.infra.adapter.out.file.mapper.BookDtoMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Slf4j
@Component
@RequiredArgsConstructor
public class JsonBookLoaderAdapter {

    private final ObjectMapper objectMapper;
    private final BookRepositoryPort bookRepository;
    private final BookValidatorUseCase bookValidator;
    private final BookDtoMapper bookDtoMapper;

    @Value("classpath:books/*.json")
    private Resource[] bookResources;

    @PostConstruct
    public void loadBooksOnStartup() {
        log.info("Starting to load adventure books from JSON files...");

        if (bookResources == null) {
            log.warn("No book resources found in classpath:books/");
            return;
        }

        for (Resource resource : bookResources) {
            try {
                if (resource.contentLength() == 0) {
                    log.warn("Skipping empty file: {}", resource.getFilename());
                    continue;
                }

                BookJsonDto dto = objectMapper.readValue(resource.getInputStream(), BookJsonDto.class);

                Book book = bookDtoMapper.toDomain(dto);

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
}