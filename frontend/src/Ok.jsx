import React, { useState } from 'react';
import "./App.css"
import img from "./ok.avif"
function App(p) {
  const [messages, setMessages] = useState([]);

  const appendMessage = (message, position) => {
    const newMessage = { text: message, position: position };
    setMessages([...messages, newMessage]);
  };
  return (
    <div className="Apple" style={{backgroundImage:`url(${img})`,height:'100vh',width:'100vw'}}>
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
