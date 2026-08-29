package com.pictet.adventure.infra.adapter.out.file.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BookJsonDto(
        String id,

        @NotBlank(message = "Book title is required")
        String title,

        @NotBlank(message = "Book author is required")
        String author,

        String difficulty,
        String description,
        List<String> tags,

        @NotEmpty(message = "Book must contain at least one section")
        List<SectionJsonDto> sections
) {}
