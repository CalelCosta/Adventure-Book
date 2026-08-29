package com.pictet.adventure.infra.adapter.out.file.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SectionJsonDto(
        @NotBlank(message = "Section id is required")
        String id,

        String title,

        @NotBlank(message = "Section text is required")
        String text,

        String type,

        List<OptionJsonDto> options
) {}
