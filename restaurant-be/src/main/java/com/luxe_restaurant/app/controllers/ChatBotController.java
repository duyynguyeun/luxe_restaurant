package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.domain.dto.ChatBotRequest;
import com.luxe_restaurant.domain.service.ChatBotService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
public class ChatBotController {
    private final ChatBotService chatBotService;

    public ChatBotController(ChatBotService chatBotService) {
        this.chatBotService = chatBotService;
    }

    @PostMapping()
    public String chatMessage(@RequestBody ChatBotRequest chatBotRequest) {
        return chatBotService.generation(chatBotRequest);
    }

}
