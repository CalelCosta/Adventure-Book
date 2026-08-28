package com.pictet.adventure.infra.adapter.out.file.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ConsequenceJsonDto(String type, String value) {}
