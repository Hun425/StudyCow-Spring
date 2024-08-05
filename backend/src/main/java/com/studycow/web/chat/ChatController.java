package com.studycow.web.chat;

import com.studycow.dto.chat.ChatMessage;
import com.studycow.dto.chat.ChatRoom;
import com.studycow.repository.chat.ChatRoomRepository;
import com.studycow.repository.user.UserRepository;
import com.studycow.service.chat.RedisPublisher;
import com.studycow.config.jwt.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@Tag(name = "CHAT", description = "채팅 관련 메서드")
@Slf4j
@RequestMapping("/chat")
public class ChatController {

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final RedisPublisher redisPublisher;
    private final JwtUtil jwtUtil;

    @Operation(summary = "방 생성", description = "새로운 채팅 방을 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "채팅 방 생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/room")
    public ResponseEntity<?> createRoom(@RequestParam String name, @RequestParam String roomId, @RequestHeader("Authorization") String token) {
        if (!jwtUtil.validateToken(token)) {
            return new ResponseEntity<>("Invalid token", HttpStatus.UNAUTHORIZED);
        }
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
    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> getRoomById(@PathVariable String roomId, @RequestHeader("Authorization") String token) {
        if (!jwtUtil.validateToken(token)) {
            return new ResponseEntity<>("Invalid token", HttpStatus.UNAUTHORIZED);
        }
        ChatRoom chatRoom = chatRoomRepository.getRoomById(roomId);
        if (chatRoom != null) {
            return new ResponseEntity<>(chatRoom, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("채팅 방을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
    }

    @MessageMapping("/chat/message")
    public void sendMessage(@Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
        String token = headerAccessor.getFirstNativeHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (jwtUtil.validateToken(token)) {
            int userId = jwtUtil.getUserId(token);
            String userName = userRepository.findById((long)userId).orElseThrow(()->new NoSuchElementException("유저가 없습니다")).getUserNickname();
            message.setSenderId(String.valueOf(userId));
            message.setSenderNickname(userName);
            log.info("Received message: " + message);
            boolean success = chatRoomRepository.processMessage(message);

            if (success) {
                log.info("Message processed successfully: " + message.getMessage());
            } else {
                log.error("Failed to process message: " + message.getMessage());
            }
        } else {
            log.error("Unauthorized message attempt");
        }
    }

    @Operation(summary = "메시지 전송", description = "REST API를 통해 채팅 메시지를 전송합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "메시지 전송 성공"),
            @ApiResponse(responseCode = "404", description = "채팅 방을 찾을 수 없음"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @PostMapping("/chat/message")
    public ResponseEntity<?> sendMessageRest(@RequestBody ChatMessage message, @RequestHeader("Authorization") String token) {
        if (!jwtUtil.validateToken(token)) {
            return new ResponseEntity<>("Invalid token", HttpStatus.UNAUTHORIZED);
        }

        int userId = jwtUtil.getUserId(token);
        message.setSenderId(String.valueOf(userId));

        boolean success = chatRoomRepository.processMessage(message);

        if (success) {
            return new ResponseEntity<>(message, HttpStatus.OK);
        } else {
            if (chatRoomRepository.getRoomById(message.getRoomId()) == null) {
                return new ResponseEntity<>("채팅 방을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>("메시지 전송 실패", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}