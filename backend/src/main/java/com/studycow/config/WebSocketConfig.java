package com.studycow.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 *  <pre>
 *      STOMP 사용을 위한 configureMessageBroker 구현
 *  </pre>
 * @author 채기훈
 * @since JDK17
 */
@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
@EnableWebSocket
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/sub"); // 해당 주소를 구독하고 있는 클라이언트에게 메세지 전달
        config.setApplicationDestinationPrefixes("/pub"); // 클라이언트에서 보낸 메세지를 받아줄 prefix
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-stomp") //SockJS 연결 주소
                .setAllowedOriginPatterns("*");
//                .setAllowedOrigins("*");
//                .withSockJS();
    }

}
