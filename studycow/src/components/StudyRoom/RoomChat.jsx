import React, { useState } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';

function RoomChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, sender: 'me' }]);
      setInput('');
    }
  };

  return (
    <div className="border p-3 bg-white" style={{ height: '300px', overflowY: 'auto' }}>
      {messages.map((msg, index) => (
        <div key={index} className={`d-flex ${msg.sender === 'me' ? 'justify-content-end' : 'justify-content-start'}`}>
          <div className={`p-2 m-1 ${msg.sender === 'me' ? 'bg-primary text-white' : 'bg-light text-dark'}`}>
            {msg.text}
          </div>
        </div>
      ))}
      <InputGroup className="mt-3">
        <FormControl
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <Button variant="primary" onClick={handleSend}>
          전송
        </Button>
      </InputGroup>
    </div>
  );
}

export default RoomChat;
