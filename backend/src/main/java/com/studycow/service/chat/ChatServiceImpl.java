package com.studycow.service.chat;

import com.studycow.domain.StudyRoom;
import com.studycow.domain.User;
import com.studycow.domain.UserStudyRoomChat;
import com.studycow.repository.chat.UserStudyRoomChatRepository;
import com.studycow.repository.studyroom.StudyRoomRepository;
import com.studycow.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

//    private final RedisTemplate<String, UserStudyRoomChat> redisTemplate;
//
//    /** WebSocketConfig 설정으로 의존성 주입 **/
//    private final SimpMessagingTemplate messagingTemplate;
//    private final StudyRoomRepository studyRoomRepository;
//    private final UserRepository userRepository;
//    private final UserStudyRoomChatRepository userStudyRoomChatRepository;
//
//    private static final int REDIS_MESSAGE_LIMIT = 50;
//    private static final int BATCH_SIZE = 50;
//
//    @Override
//    public void sendMessage(UserStudyRoomChat chatMessage) {
//        String key = "chat:room:" + chatMessage.getStudyRoom().getId();
//        redisTemplate.opsForList().leftPush(key, chatMessage);
//        redisTemplate.opsForList().trim(key,-REDIS_MESSAGE_LIMIT,-1);
//
//        messagingTemplate.convertAndSend("/topic/studyroom/" + chatMessage.getId(),chatMessage);
//
//        CompletableFuture.runAsync(()->checkAndSaveToRdb(chatMessage.getStudyRoom().getId()));
//    }
//
//    @Override
//    public void checkAndSaveToRdb(Long studyRoomId) {
//        String key = "chat:room:" + studyRoomId;
//        Long size = redisTemplate.opsForList().size(key);
//        if(size != null && size >= REDIS_MESSAGE_LIMIT) {
//            List<UserStudyRoomChat> messages = redisTemplate.opsForList().range(key, 0, BATCH_SIZE-1);
//            if(messages!=null && !messages.isEmpty()){
//                userStudyRoomChatRepository.saveAll(messages);
//                redisTemplate.opsForList().trim(key,BATCH_SIZE,-1);
//            }
//        }
//    }
//
//    @Override
//    public List<UserStudyRoomChat> getRecentChatMessage(Long studyRoomId, int count) {
//        String key = "chat:room:" + studyRoomId;
//        List<UserStudyRoomChat> recentMessages = redisTemplate.opsForList().range(key, -count, -1);
//        if(recentMessages.size() < count){
//            List<UserStudyRoomChat> dbMessages = userStudyRoomChatRepository.findByStudyRoomIdOrderByChatInDateDesc(
//                    studyRoomId, PageRequest.of(0,count - recentMessages.size()));
//            recentMessages.addAll(dbMessages);
//        }
//
//        return recentMessages;
//    }
//

}
