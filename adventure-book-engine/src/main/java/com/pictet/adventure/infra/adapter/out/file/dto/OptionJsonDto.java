package com.pictet.adventure.infra.adapter.out.file.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OptionJsonDto(
        @NotBlank(message = "Option description is required")
        String description,

        @NotBlank(message = "Option gotoId is required")
        String gotoId,

        ConsequenceJsonDto consequence,
        String requirement
) {}
