package com.luxe_restaurant.domain.service;

import com.luxe_restaurant.domain.dto.ChatBotRequest;

public interface ChatBotService {
    public String generation(ChatBotRequest chatBotRequest);
}
