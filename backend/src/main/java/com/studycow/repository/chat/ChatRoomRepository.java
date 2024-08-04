package com.studycow.repository.chat;

import com.studycow.dto.chat.ChatRoom;
import com.studycow.service.chat.RedisSubscriber;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * <pre>
 *     채팅방 세션 관리를 위한 Repository
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@RequiredArgsConstructor
@Repository
public class ChatRoomRepository {

    private final RedisMessageListenerContainer redisMessageListenerContainer;
    private final RedisSubscriber redisSubscriber;
    private static final String CHAT_ROOMS = "CHAT_ROOM";
    private final RedisTemplate<String,Object> redisTemplate;
    private  HashOperations<String, String, ChatRoom> opsHashRoomChat;

    private Map<String, ChannelTopic> topics;

    @PostConstruct
    public void init() {
        opsHashRoomChat = redisTemplate.opsForHash();
        topics = new ConcurrentHashMap<>();
    }

    public ChatRoom getRoomById(String roomId) {
        return opsHashRoomChat.get(CHAT_ROOMS, roomId);
    }

    public ChatRoom createRoom(String name, String roomId) {
        ChatRoom chatroom = ChatRoom.create(roomId,name);
        opsHashRoomChat.put(CHAT_ROOMS, roomId, chatroom);
        return chatroom;
    }

    public void enterRoom(String roomId) {
        ChannelTopic topic = topics.get(roomId);
        if(topic == null) {
            topic = new ChannelTopic(roomId);
            redisMessageListenerContainer.addMessageListener(redisSubscriber, topic);
            topics.put(roomId, topic);
        }
    }

    public void leaveRoom(String roomId) {
        ChannelTopic topic = topics.remove(roomId);
        if (topic != null) {
            redisMessageListenerContainer.removeMessageListener(redisSubscriber, topic);
        }
    }

    public ChannelTopic getTopic(String roomId) {
        return topics.get(roomId);
    }
}
