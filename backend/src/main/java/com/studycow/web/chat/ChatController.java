package com.studycow.web.chat;

import com.studycow.dto.chat.ChatMessage;
import com.studycow.dto.chat.ChatRoom;
import com.studycow.repository.chat.ChatRoomRepository;
import com.studycow.service.chat.RedisPublisher;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "CHAT", description = "채팅 관련 메서드")
@Slf4j
public class ChatController {

    private final ChatRoomRepository chatRoomRepository;
    private final RedisPublisher redisPublisher;

    @Operation(summary = "방 생성", description = "새로운 채팅 방을 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "채팅 방 생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/rooms")
    public ResponseEntity<?> createRoom(@RequestParam String name, @RequestParam String roomId) {
        try {
            ChatRoom chatRoom = chatRoomRepository.createRoom(name, roomId);
            return new ResponseEntity<>(chatRoom, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "방 정보 조회", description = "특정 채팅 방의 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "채팅 방 정보 조회 성공"),
            @ApiResponse(responseCode = "404", description = "채팅 방을 찾을 수 없음")
    })
    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<?> getRoomById(@PathVariable String roomId) {
        ChatRoom chatRoom = chatRoomRepository.getRoomById(roomId);
        if (chatRoom != null) {
            return new ResponseEntity<>(chatRoom, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("채팅 방을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "방에 입장", description = "채팅 방에 입장합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "방 입장 성공"),
            @ApiResponse(responseCode = "404", description = "채팅 방을 찾을 수 없음")
    })
    @PostMapping("/rooms/{roomId}/enter")
    public ResponseEntity<?> enterRoom(@PathVariable String roomId) {
        ChatRoom chatRoom = chatRoomRepository.getRoomById(roomId);
        if (chatRoom != null) {
            try {
                chatRoomRepository.enterRoom(roomId);
                return new ResponseEntity<>(HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>("채팅 방을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
    }


    @MessageMapping("/chat/message")
    public void sendMessage(ChatMessage message) {
        log.info(message.toString());
        ChannelTopic topic = chatRoomRepository.getTopic(message.getRoomId());
        log.info(topic.toString());
        if (topic != null) {
            try {
                log.info("topic :"+topic.toString()+" message: " + message.getMessage());
                redisPublisher.publish(topic, message);

            } catch (Exception e) {
                log.info(e.getMessage());
            }
        }
    }

    @Operation(summary = "메시지 전송", description = "REST API를 통해 채팅 메시지를 전송합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "메시지 전송 성공"),
            @ApiResponse(responseCode = "404", description = "채팅 방을 찾을 수 없음")
    })
    @PostMapping("/chat/message")
    public ResponseEntity<?> sendMessageTest(@RequestBody ChatMessage message) {
        ChannelTopic topic = chatRoomRepository.getTopic(message.getRoomId());
        if (topic != null) {
            try {
                log.info("topic :"+topic.toString()+" message: " + message.getMessage());
                redisPublisher.publish(topic, message);
                return new ResponseEntity<>(message, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>("채팅 방을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
    }


}
