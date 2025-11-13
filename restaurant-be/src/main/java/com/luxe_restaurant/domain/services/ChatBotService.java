package com.luxe_restaurant.domain.services;

import com.luxe_restaurant.app.requests.ChatBotRequest;

public interface ChatBotService {
    String generation(ChatBotRequest chatBotRequest);
}
