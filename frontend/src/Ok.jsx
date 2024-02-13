import React, { useState } from 'react';

function App(p) {
  const [messages, setMessages] = useState([]);

  const appendMessage = (message, position) => {
    const newMessage = { text: message, position: position };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="App">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.position}`}>
            {message.text}
          </div>
        ))}
      </div>
      <button onClick={() => appendMessage('New Message', 'right')}>Append Message</button>
    </div>
  );
}

export default App;
