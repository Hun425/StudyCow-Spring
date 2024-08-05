import React, { useRef, useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useInfoStore from '../../stores/infos';
import sendButton from './img/sendButton.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/RoomChat.css'

let stompClient = null;
const roomId = '1';

function RoomChat() {
  const { token, userInfo } = useInfoStore();
  
  const [messages, setMessages] = useState([]);
  const messageInputRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const [input, setInput] = useState('');

  // 연결
  const connect = () => {
    // 소켓 선언
    const socket = new SockJS('http://localhost:5173/studycow/ws-stomp');
    
    // 클라이언트 생성
    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/sub/chat/room/' + roomId, function(message) {
          showMessage(JSON.parse(message.body));
        });
        sendEnterMessage();
      },
      onStompError: (frame) => {
        console.error('STOMP error: ' + frame);
        alert('웹소켓 서버 접속 불가');
      }
    });

    // 헤더 설정
    stompClient.connectHeaders = {
      'Authorization': 'Bearer ' + token
    };

    // 클라이언트 활성화
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
      e.preventDefault(); // Prevents the default behavior of the Enter key
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
  }, []);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div id="chat-container" className="d-flex flex-column">
      <div
        id="chat-messages"
        className="overflow-auto flex-grow-1 p-2"
        ref={chatMessagesRef}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.senderNickname === userInfo.userNickName ? 'my-message' : 'other-message'}
          >
            {message.senderNickname || 'Unknown'}: {message.message}
          </div>
        ))}
      </div>
      <div className="d-flex">
        <input
          type="text"
          id="message-input"
          ref={messageInputRef}
          className="form-control"
          placeholder="Type a message..."
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage} className='messageSendButton'>
          <img className='sendButtonImg' src={sendButton} alt="전송" />
        </button>
      </div>
    </div>
  );
}

export default RoomChat;
