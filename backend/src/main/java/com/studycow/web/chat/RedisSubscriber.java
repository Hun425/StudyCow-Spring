package com.studycow.web.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studycow.dto.chat.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class RedisSubscriber implements MessageListener {

    private final ObjectMapper mapper;
    private final RedisTemplate redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;


    @Override
    public void onMessage(Message message, byte[] pattern) {
        try{
            // redis에서 발행된 데이터를 받아 deserialize
            String publishMessage = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());
            // ChatMessage 객체로 맵핑
            ChatMessage roomMessage = mapper.readValue(publishMessage, ChatMessage.class);
            // Websocket 구독자에게 채팅 메세지 Send
            messagingTemplate.convertAndSend("/sub/chat/room/"+roomMessage.getRoomId(),roomMessage);
        }catch(Exception e){
            log.error(e.getMessage());
        }
    }
}
