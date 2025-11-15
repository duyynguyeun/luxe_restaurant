package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.ChatBotRequest;
import com.luxe_restaurant.domain.services.ChatBotService;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.CrossOrigin; // <-- 1. Thêm dòng này

@CrossOrigin(origins = "http://localhost:5173") // <-- 2. Thêm dòng này (dùng 5173 như bạn nói)
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
