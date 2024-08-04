package com.studycow.web.chat;

import com.studycow.dto.chat.ChatRoom;
import com.studycow.repository.chat.ChatRoomRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "ChatRoom", description = "채팅방 관리")
@RequiredArgsConstructor
@RestController
public class ChatRoomController {

    private final ChatRoomRepository chatRoomRepository;

    @Operation(summary = "채팅방 생성", description = "번호에 맞는 채팅방을 생성합니다.")
    @PostMapping("/create/room")
    public ResponseEntity<?> createRoom(@RequestBody ChatRoom chatRoom) {
        try {
            ChatRoom chatroom = chatRoomRepository.createRoom(chatRoom.getRoomId(), chatRoom.getRoomName());
            return new ResponseEntity<>(chatroom.toString(), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
