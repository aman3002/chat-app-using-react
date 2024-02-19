const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const socketIo = require("socket.io");
const sessionStorage = require("sessionstorage");
const app = express();
const passport = require("passport");
const localstra = require("passport-local").Strategy;
const create = require("./practice");
const add = require("./add");
const check = require("./check");
const bodyParser = require("body-parser");
let z, q;
let p = {};

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new localstra(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        sessionStorage.setItem("username", username);
        const user = await add.getUser(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.username);
});
passport.deserializeUser((id, done) => {
  done(null, id);
});
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "X-Auth-Token",
      "Origin",
      "Authorization",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin",
      "Accept",
      "X-Requested-With",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
    credentials: true,
  })
);

const server = http.createServer(app);
const io = socketIo(server);
const users = {};

io.on("connection", async (socket) => {
  console.log(p)
  socket.on("new-user", async (w) => {
    q = w.name;
    z = w.room;
    p[z]=[]
    let l = 0;
    p[z].forEach((item)=>{
      if(item==q){
        socket.emit("alert2")
        l=1
      }
    })
    let a1 = await check();
    if (a1) {
      a1.forEach((item) => {
        if (q == item) {
          l = 1;
        }
      });
    }
    if (l == 1) {
      socket.emit("alert");
      l=0
    } else {
      socket.join(z);
      await create(q);
      await add.add_data(q, w.pass);
      users[socket.id] = q;
      p[z].push(q);
      socket.emit("online",p[z])
      l = { message: q + " joined", position: "right" };
      socket.to(z).emit("userjoined", l);
      socket.emit("ok")
    }
  });
  socket.on("login", async (aw) => {
     z=aw.room
    let j=0
    if(!p[z]||p[z].length==0){
      p[z]=[]
    }
    else{
    p[z].forEach((item)=>{
      if(item==aw.email){
        socket.emit("alert2")
        j=1
      }
    })}
    if(j!=1){
    let l = await add.getUser(aw.email);
    if (l.password == aw.pass) {
      [q,z]=[aw.email,aw.room]
      socket.emit("ok", true);
      socket.join(z);
      let a = await add.get_data(q, z);
      users[socket.id] = q;
      await p[z].push(q);
      console.log(p,"buhnijnih n")
      socket.emit("online",p[z])
      l = { message: q + " joined", position: "right" };
      socket.to(z).emit("userjoined", l);
      io.to(socket.id).emit("lost", a);
      
    } else {
      socket.emit("fail", false);
    }
  }
  });
  socket.on("send", async (message) => {
    const [room,sender,messa] = [message.room,message.sender,message.message];
    const name = users[socket.id];
    const position = "left";
    p.forEach(async (item) => {
      await add.add_message(name, item, messa, room, position);
  });
    // Ensure room is correctly retrieved from the message object
    console.log("Sending message to room:", room);
    socket.broadcast.to(room).emit("new-receive", { message: messa, name: sender, room: room, position: position });
    });
  socket.on("ok2",()=>{
    socket.emit("online",p[z])
  })
  socket.on("disconnect", async () => {
    const userName = users[socket.id];
    await socket.leave(z);
    console.log(z,userName)
    if (!p[z] || p[z].length === 0) {
        p[z] = [];
    } else {
        p[z] = p[z].filter((item) => item !== userName);
    }
    
    await io.emit("online", p[z]); // Broadcast to all clients
    console.log(p, "oklp");
    
    let useName = { message: userName + " left the chat", position: "right" };
    socket.to(z).emit("dist", useName);
});

});

server.listen(8001);
