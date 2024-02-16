import './App.css';
import io from "socket.io-client"
import C from "./Cjat"
import React,{useState,useEffect} from "react"
const socket = io.connect("http://localhost:8001",{transports:["websocket"]});
function App() {
  
  const [name,setname]=useState("")
    // const [messages, setMessages] = useState([]);
  
    // const appendMessage = (message, position) => {
    //   const newMessage = { text: message, position: position };
    //   setMessages([...messages, newMessage]);
    // }
  const [joins,setjoin]=useState(0)
  const [room,setroom]=useState("")
  let [kl,setkl]=useState(0);
  let [uses,setuses]=useState(0)
  let [pass,setpass]=useState("")
 useEffect(()=>{
  socket.on("fail",async(data)=>{
    return setkl(0)
  })
  socket.on("ok",(data)=>{
    return setkl(1)
  })
  })
  const join=()=>{
    console.log("ok")
    if(name!=="" && room!==""){
      console.log("1234")
      console.log(name+room)
    // socket.emit("new-user",{"name":name,"room":room,"pass":pass})
    socket.emit("login",{"email":name ,"pass":pass,"room":room})
  }}
  const joined=()=>{
    console.log("ok")
    if(name!=="" && room!==""){
      console.log("1234")
      console.log(name+room)
    socket.emit("new-user",{"name":name,"room":room,"pass":pass})
    setkl(1)
  }}
  
  return (
    uses===0?<div className='input'>
      <button onClick={()=>{setjoin(1);
      setuses(1)}}>login</button>
      <br/><button onClick={()=>{setjoin(0);
      setuses(1)}}>sign up</button>
    </div>:
    joins===1?
    kl===0?
    <div className="input">
      <br/><input type='text' placeholder='user' value={name} required onChange={(event)=>{setname(event.target.value)}} />
      <br/>
      <input required type='text' placeholder="pass" value={pass} onChange={(event)=>{setpass(event.target.value)}}/>
      <br/>
      <input required type='text' placeholder="room" value={room} onChange={(event)=>{setroom(event.target.value)}}/>
      <br/>
      <button onClick={join} >submit</button>
      </div>
      :
      <div>
      <C socket={socket} user={name} room={room} />

    </div>
    :
    kl===0?
    <div className="text">
      <br/>
      <input type='text' required placeholder='user' value={name} onChange={(event)=>{setname(event.target.value)}} />
      <br/>
      <input type='text' required placeholder="pass" value={pass} onChange={(event)=>{setpass(event.target.value)}}/>
      <br/>
      <input type='text' required placeholder="room" value={room} onChange={(event)=>{setroom(event.target.value)}}/>
      <br/>
      <button onClick={joined} >submit</button>
      </div>
      :
      <div>
      <C socket={socket} user={name} room={room} />

    </div> 
  );

  }

export default App;
