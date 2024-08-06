package com.studycow.repository.chat;

import com.studycow.config.jwt.JwtUtil;
import com.studycow.dto.chat.ChatMessage;
import com.studycow.dto.chat.ChatRoom;
import com.studycow.service.chat.RedisSubscriber;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Repository
public class ChatRoomRepository {

    private final RedisMessageListenerContainer redisMessageListenerContainer;
    private final RedisSubscriber redisSubscriber;
    private final JwtUtil jwtUtil; // JWT 검증 서비스
    private static final String CHAT_ROOMS = "CHAT_ROOM";
    private final RedisTemplate<String, Object> redisTemplate;
    private HashOperations<String, String, ChatRoom> opsHashChatRoom;

    private Map<String, ChannelTopic> topics;

    @PostConstruct
    private void init() {
        opsHashChatRoom = redisTemplate.opsForHash();
        topics = new ConcurrentHashMap<>();
    }

    public ChatRoom getRoomById(String roomId) {
        return opsHashChatRoom.get(CHAT_ROOMS, roomId);
    }

    public ChatRoom createRoom(String name, String roomId) {
        ChatRoom chatRoom = ChatRoom.create(roomId, name);
        opsHashChatRoom.put(CHAT_ROOMS, roomId, chatRoom);
        return chatRoom;
    }

    /**
     * 메세지 전송 프로세스 진행
     * @param chatMessage
     * @return true : 성공 , false : 실패
     */
    public boolean processMessage(ChatMessage chatMessage) {
        if (chatMessage.getType() == ChatMessage.MessageType.ENTER) {
            return enterRoom(chatMessage);
        }
        else if (chatMessage.getType() == ChatMessage.MessageType.LEAVE) {
            return leaveRoom(chatMessage);
        }
        else {
            return publishMessage(chatMessage.getRoomId(), chatMessage);
        }
    }

    /**
     * 방 입장
     * @param chatMessage
     * @return true : 성공, false : 실패
     */
    private boolean enterRoom(ChatMessage chatMessage) {

        String roomId = chatMessage.getRoomId();
        ChannelTopic topic = topics.computeIfAbsent(roomId, id -> {
            ChannelTopic newTopic = new ChannelTopic(id);
            redisMessageListenerContainer.addMessageListener(redisSubscriber, newTopic);
            return newTopic;
        });

        // 입장 메시지 발행
        chatMessage.setMessage(chatMessage.getSenderNickname() + "님이 입장하셨습니다.");
        return publishMessage(roomId, chatMessage);
    }

    /**
     * 사용자 퇴장
     * @param chatMessage
     * @return true : 성공 , false : 실패
     */
    public boolean leaveRoom(ChatMessage chatMessage) {
        String roomId = chatMessage.getRoomId();
        chatMessage.setType(ChatMessage.MessageType.LEAVE); //
        chatMessage.setMessage(chatMessage.getSenderNickname() + "님이 퇴장하셨습니다.");
        return publishMessage(roomId, chatMessage);
    }

    public ChannelTopic getTopic(String roomId) {
        return topics.get(roomId);
    }

    /**
     * 메세지 전송
     * @param roomId
     * @param chatMessage
     * @return true : 성공 , false : 실패
     */
    public boolean publishMessage(String roomId, ChatMessage chatMessage) {
        ChannelTopic topic = getTopic(roomId);
        if (topic != null) {
            redisTemplate.convertAndSend(topic.getTopic(), chatMessage);
            return true;
        }
        return false;
    }
}