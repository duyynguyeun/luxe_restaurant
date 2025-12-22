package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.responses.chat.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    // Client sẽ gửi message tới /app/chat
    @MessageMapping("/chat")
    public void handleChatMessage(ChatMessage message) {
        // Gán timestamp server side
        message.setTimestamp(LocalDateTime.now());

        // Gửi tới tất cả client subscribe /topic/public
        messagingTemplate.convertAndSend("/topic/public", message);
    }
}
