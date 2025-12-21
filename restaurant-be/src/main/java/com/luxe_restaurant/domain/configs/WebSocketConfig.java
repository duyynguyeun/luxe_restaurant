package com.luxe_restaurant.domain.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Kích hoạt một "Broker" đơn giản để gửi tin nhắn ngược lại cho Client
        // Client sẽ lắng nghe các tin nhắn bắt đầu bằng /topic
        config.enableSimpleBroker("/topic");
        
        // Tiền tố cho các tin nhắn từ Client gửi lên Server (nếu có)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Định nghĩa endpoint để Frontend kết nối vào
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Cho phép React truy cập
                .withSockJS(); // Hỗ trợ các trình duyệt cũ
    }
}