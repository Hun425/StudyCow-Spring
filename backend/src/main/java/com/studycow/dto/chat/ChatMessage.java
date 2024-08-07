package com.studycow.dto.chat;

import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *     채팅방 메세지 전달을 위한 클래스
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@Getter
@Setter
public class ChatMessage {

    public enum MessageType {
        ENTER, TALK,LEAVE
    }

    private MessageType type;
    private String roomId;
    private String senderId;
    private String senderNickname;
    private String message;

    @Override
    public String toString() {
        return "ChatMessage [type=" + type + ", roomId=" + roomId + ", senderId=" +senderId
                + ", senderNickname=" + senderNickname + ", message=" + message + "]";
    }
}
