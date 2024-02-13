import React, { useEffect, useState } from "react";
import "./App.css";

function Chat({ socket, user, room }) { // Changed Cjat to Chat
  const [message, setMess] = useState(""); // Changed setMess to setMessage
  const [messages, setMessages] = useState([]);

  const send = async () => {
    if (message !== "") {
      const mess = {
        room: room,
        sender: user,
        message: message,
        position: "right",
      };
      setMessages(prevMessages => [...prevMessages, mess]);
      await socket.emit("send", mess);
      setMess("");
    }
  };
  

  useEffect(() => {
    const handleLost = (chatMessage) => {
      console.log("getted")
      console.log(chatMessage)
      if (Array.isArray(chatMessage)) {
        console.log("arrayed")
        const updatedMessages = chatMessage.map((item) => {
          if (item.user === item.sender) {
            return {
              ...item,
              position: "right",
            };
          } else {
            return { ...item, position: "left" };
          }
        
        });
        setMessages(updatedMessages);
      
    
    
      setMessages(updatedMessages);
    }};

    const handleReceive = (message) => {
      setMessages((prevMessages) => [...prevMessages,message]);
    };
    const joined=(message)=>{
      console.log("##################################################################################################################S")
      setMessages((nosse)=>[...nosse,message]);
    };
    const dist=(messa)=>{
      setMessages((no)=>[...no,messa]);
    };
    socket.on("lost", handleLost);
    socket.on("new-receive", handleReceive); // Corrected event name
    socket.on("userjoined",joined)
    socket.on("dist",dist)
    return () => {
      socket.off("lost", handleLost);
      socket.off("new-receive", handleReceive); // Corrected event name
      socket.off("userjoined",joined)
      socket.off("dist",dist)
    
    };
  }, [socket]);

  return (
    <div>
      <div className="header">
        <p className="footr">chat window</p>
      </div>
      <div className="window">
      <div className="messages">
        {messages==[]?"":
  messages.map((message) => (
    <div
      className={`message ${message.position}`}
    >
      <strong>{message.sender||message.name}: </strong>{message.message}
    </div>
  ))}
</div>

      </div>
      <div className="footer">
        <input className="foot"
        required 
        autoFocus
          type="text"
          value={message}
          onChange={(e) => setMess(e.target.value)}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
