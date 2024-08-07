package com.studycow.dto.chat;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * <pre>
 *     채팅방 클래스
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@Getter
@Setter
public class ChatRoom implements Serializable {
    private String roomId;
    private String roomName;

    public static ChatRoom create(String roomId, String name) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setRoomId(roomId);
        chatRoom.setRoomName(name);
        return chatRoom;
    }

    @Override
    public String toString() {
        return roomId + ":" + roomName;
    }
}
