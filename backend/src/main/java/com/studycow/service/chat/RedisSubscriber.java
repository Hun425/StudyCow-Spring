package com.studycow.service.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studycow.dto.chat.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *     Redis에서 발행되는 메세지를 받기위한 구독자
 * </pre>
 * @author 채기훈
 * @since JDK17
 */

@Slf4j
@RequiredArgsConstructor
@Service
public class RedisSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    private final RedisTemplate<String, String> redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try{
            //redis에서 발행된 데이터 받아 deserialize
            String publishMessage = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());
            log.info("redis에서 받은 메세지: {}", publishMessage);
            ChatMessage chatMessage = objectMapper.readValue(publishMessage, ChatMessage.class);
            log.info("redis에서 보낸 메세지: {}", chatMessage);
            messagingTemplate.convertAndSend("/sub/chat/room/"+chatMessage.getRoomId(), chatMessage);
        }
        catch (Exception e){
            log.error(e.getMessage());
        }
    }
}
