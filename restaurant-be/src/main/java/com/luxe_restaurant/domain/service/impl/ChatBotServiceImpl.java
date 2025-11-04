package com.luxe_restaurant.domain.service.impl;

import com.luxe_restaurant.domain.dto.ChatBotRequest;
import com.luxe_restaurant.domain.service.ChatBotService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatBotServiceImpl implements ChatBotService {
    private final ChatClient chatClient;

    public ChatBotServiceImpl(ChatClient.Builder chatClient) {
        this.chatClient = chatClient
                .defaultSystem("Bạn là trợ lý ảo của nhà hàng Luxe Restaurant. Bạn sẽ trả lời v tư vấn khách hàng theo hướng hài hước và hóm hỉnh.")
                .build();
    }

    public String generation(ChatBotRequest  chatBotRequest) {
        return chatClient.prompt()
                .user(chatBotRequest.getQuestion())
                .call()
                .content();
    }
}
