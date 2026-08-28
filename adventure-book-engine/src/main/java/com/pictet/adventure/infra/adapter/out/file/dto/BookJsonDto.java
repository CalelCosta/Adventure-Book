package com.pictet.adventure.infra.adapter.out.file.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BookJsonDto(String title, String author, List<SectionJsonDto> sections) {}
