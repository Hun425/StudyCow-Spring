package com.studycow.service.chat;

import com.studycow.dto.chat.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *     Redis에서 메세지를 발행하기위한 Service
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@RequiredArgsConstructor
@Service
@Slf4j
public class RedisPublisher {
    private final RedisTemplate<String, Object> redisTemplate;

    public void publish(ChannelTopic topic, ChatMessage message) {
        log.info("Publishing to channel: {}, message: {}", topic.getTopic(), message);

        redisTemplate.convertAndSend(topic.getTopic(),message);
    }
}
