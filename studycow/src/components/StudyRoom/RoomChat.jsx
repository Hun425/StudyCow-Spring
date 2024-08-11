import React, { useRef, useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useInfoStore from '../../stores/infos';
import { Paper, Typography, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/RoomChat.css';

let stompClient = null;

function RoomChat({ roomId }) {
  const { token, userInfo } = useInfoStore();
  
  const [messages, setMessages] = useState([]);
  const messageInputRef = useRef(null);
  const chatMessagesRef = useRef(null);

  // 연결
  const connect = () => {
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const socket = new SockJS(`${protocol}//${window.location.host}/studycow/ws-stomp`);
    
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
        console.error('STOMP error: ' + frame);
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
        sendChatMessage('LEAVE');
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
    <Paper className="chat-container" elevation={3}>
      <div
        id="chat-messages"
        className="chat-messages"
        ref={chatMessagesRef}
      >
        {messages.map((message, index) => (
          <div key={index}>
            {message.type === 'TALK' && (
              <Typography
                variant="subtitle2"
                className={message.senderNickname === userInfo.userNickName ? 'my-nickname' : 'other-nickname'}
              >
                {message.senderNickname}
              </Typography>
            )}
            <Typography
              variant="body2"
              className={message.type === 'ENTER' || message.type === 'LEAVE' ? 'enter-message' : (message.senderNickname === userInfo.userNickName ? 'my-message' : 'other-message')}
            >
              {message.message}
            </Typography>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <TextField
          className='roomInputItem'
          fullWidth
          inputRef={messageInputRef}
          placeholder="채팅 입력하기"
          onKeyDown={handleKeyDown}
          variant="outlined"
          size="small"
        />
        <IconButton onClick={sendMessage}>
          <SendIcon className='roomMessageSendIcon'/>
        </IconButton>
      </div>
    </Paper>
  );
}

export default RoomChat;
