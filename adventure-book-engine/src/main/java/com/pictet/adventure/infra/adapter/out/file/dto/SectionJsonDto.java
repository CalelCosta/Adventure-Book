package com.pictet.adventure.infra.adapter.out.file.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SectionJsonDto(int id, String type, String text, List<OptionJsonDto> options) {}
