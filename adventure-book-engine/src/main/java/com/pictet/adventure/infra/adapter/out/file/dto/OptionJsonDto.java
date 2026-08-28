package com.pictet.adventure.infra.adapter.out.file.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OptionJsonDto(String description, Integer gotoId, ConsequenceJsonDto consequence) {}
