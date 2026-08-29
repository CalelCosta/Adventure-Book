package com.pictet.adventure.infra.adapter.in.web;

import com.pictet.adventure.domain.model.GameSession;
import com.pictet.adventure.domain.port.in.MakeChoiceUseCase;
import com.pictet.adventure.domain.port.in.StartGameUseCase;
import com.pictet.adventure.infra.config.JacksonConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(GameController.class)
@Import(JacksonConfig.class)
class GameControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private StartGameUseCase startGameUseCase;

    @MockitoBean
    private MakeChoiceUseCase makeChoiceUseCase;

    @Test
    @DisplayName("POST /api/v1/games/start should return 200 OK and session details")
    void shouldStartGameViaRest() throws Exception {
        GameSession mockSession = GameSession.builder()
                .id("session-999")
                .bookId("book-1")
                .currentSectionId(1)
                .build();

        when(startGameUseCase.execute("book-1")).thenReturn(mockSession);

        Map<String, String> requestBody = Map.of("bookId", "book-1");

        mockMvc.perform(post("/api/v1/games/start")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("session-999"))
                .andExpect(jsonPath("$.player.healthPoints").value(10)) //[cite: 1]
                .andExpect(jsonPath("$.currentSectionId").value(1));
    }
}