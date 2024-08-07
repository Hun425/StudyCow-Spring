import { useRef, useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useInfoStore from '../../stores/infos';

let stompClient = null;

const useRoomChat = (roomId) => {
  const { token, userInfo } = useInfoStore();
  const [messages, setMessages] = useState([]);
  const messageInputRef = useRef(null);
  const chatMessagesRef = useRef(null);

  // 연결
  const connect = () => {
    const socket = new SockJS('http://localhost:5173/studycow/ws-stomp');
    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log('STOMP: ' + str);
      },
      onConnect: (frame) => {
        stompClient.subscribe('/sub/chat/room/' + roomId, function(message) {
          showMessage(JSON.parse(message.body));
        });
        sendEnterMessage();
      },
      onStompError: (frame) => {
        alert('웹소켓 서버 접속 불가');
      }
    });

    stompClient.connectHeaders = {
      'Authorization': 'Bearer ' + token
    };

    stompClient.activate();
  };

  const sendEnterMessage = () => {
    sendChatMessage('ENTER', '님이 입장하였습니다.');
  };

  const sendMessage = () => {
    const messageInput = messageInputRef.current;
    const message = messageInput.value.trim();
    if (message) {
      sendChatMessage('TALK', message);
      messageInput.value = '';
    }
  };

  const sendChatMessage = (type, message) => {
    if (stompClient && stompClient.active) {
      const chatMessage = {
        type: type,
        roomId: roomId,
        message: message
      };
      stompClient.publish({
        destination: "/pub/chat/message",
        headers: { 'Authorization': token },
        body: JSON.stringify(chatMessage)
      });
    } else {
      console.error('STOMP 클라이언트에 연결되지 않음.');
      alert('서버에 연결되지 않음.');
    }
  };

  const showMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    connect();
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  return {
    messages,
    messageInputRef,
    chatMessagesRef,
    sendMessage,
    handleKeyDown
  };
};

export default useRoomChat;
