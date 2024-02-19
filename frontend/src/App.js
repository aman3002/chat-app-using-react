import './App.css';
import io from "socket.io-client"
import C from "./Cjat"
import img from "./ok.avif"
import React,{useState,useEffect} from "react"
const socket = io.connect("https://chat-server-lctb.onrender.com",{transports:["websocket"]});
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
  let [alerts,setalert]=useState(0)
  let [alerts2,setalert2]=useState(0)
  let [pass,setpass]=useState("")
 useEffect(()=>{
  socket.on("fail",async(data)=>{
    return setkl(0)
  })
  socket.on("ok",()=>{
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
  }}
  
 // Define a flag variable to track whether the alert has been shown
// Listen for the "alert" event from the socket
socket.once("alert", () => {
  // Display the alert
  setalert(1)
});
socket.once("alert2", () => {
  // Display the alert
  setalert2(1)
});
  return (
    uses===0?<div className='loginsign'>
      <div><button  className='b1' onClick={()=>{setjoin(1);
      setuses(1)}}>login</button></div>
      <div>
      <br/><button className='b2' onClick={()=>{setjoin(0);
      setuses(1)}}>sign up</button></div>
    </div>:
    joins===1?
    kl===0?
    <div className='container'>
    <div className="form">
      <br/><input className="input" type='text' placeholder='user' value={name} required onChange={(event)=>{setname(event.target.value)}} />
      <br/>
      <input required type='text'  className="input" placeholder="pass" value={pass} onChange={(event)=>{setpass(event.target.value)}}/>
      <br/>
      <input required type='text' placeholder="room" className="input" value={room} onChange={(event)=>{setroom(event.target.value)}}/>
      <br/>
      <button onClick={join} className="input" >submit</button>
      <div>
        {
          alerts2==1?<h4>user is already in the room</h4>:""
        }
      </div>
      </div>
      </div>
      :
      <div style={{backgroundImage:`url(${img})`,height:'100vh',width:'100vw', 'background-size': 'cover','background-position': 'center top'}} >
      <C socket={socket} user={name} room={room} />

    </div>
    :
    kl===0?
    <div className='container'> 
    <div className="form">
      <br/>
      <input type='text' className="input" required placeholder='user' value={name} onChange={(event)=>{setname(event.target.value)}} />
      <br/>
      <input type='text' className="input" required placeholder="pass" value={pass} onChange={(event)=>{setpass(event.target.value)}}/>
      <br/>
      <input type='text' className="input" required placeholder="room" value={room} onChange={(event)=>{setroom(event.target.value)}}/>
      <br/>
      <button onClick={joined} className="input" >submit</button>
      <div>
        {alerts==1?
          <h4>username is already taken</h4>:""
        }
        {
          alerts2==1?<h4>user is already in the room</h4>:""
        }
      </div>
      </div>
      </div>
      :
      <div style={{backgroundImage:`url(${img})`,height:'100vh',width:'100vw','backgroundSize':'cover'}}>
      <C socket={socket} user={name} room={room} />

    </div> 
  );

  }

export default App;
