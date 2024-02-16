const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const sessionStorage = require("sessionstorage");
const socketIo = require("socket.io");
const session = require("express-session");
const passport = require("passport");
const localstra = require("passport-local").Strategy;
const create = require("./practice");
const add = require("./add");
const check = require("./check");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const sessionMiddleware = session({
  secret: 'hello',
  resave: false,
  saveUninitialized: true
});

let z, q, p = [];

app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstra({
  passReqToCallback: true
},
  async (req, username, password, done) => {
    try {
      sessionStorage.setItem("username", username);
      const user = await add.getUser(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

app.use(cors({
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
}));

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

io.on("connection", async (socket) => {

  socket.on("new-user", async (w) => {
    q = w.name;
    z = w.room;

    let l = 0;
    let a1 = await check();

    if (a1) {
      a1.forEach((item) => {
        if (q == item) {
          l = 1;
        }
      });
    }

    if (l == 1) {
      socket.join(z);

      let a = await add.get_data(q, z);

      p.push(q);
      let message = { "message": q + " joined", "position": "right" };
      socket.to(z).emit("userjoined", message);
      socket.emit("lost", a);
    }
    else {
      socket.join(z);

      await create(q);
      await add.add_data(q, w.pass);

      p.push(q);
      let message = { "message": q + " joined", "position": "right" };
      socket.to(z).emit("userjoined", message);
    }
  });

  socket.on("login", async (aw) => {
    let p = await add.getUser(aw.email);
    if (p.password == aw.pass) {
      socket.emit("ok", true);
      let a = await add.get_data(aw.email, aw.room);
      socket.emit("lost", a);
    }
    else {
      socket.emit("fail", false);
    }
  });

  socket.on("send", async (message) => {
    const chatMessage = { data: p, message: message.message, name: q, room: z, position: "left" };

    chatMessage.data.forEach(async (item) => {
      await add.add_message(chatMessage.name, item, chatMessage.message, chatMessage.room, chatMessage.position);
    });

    socket.to(chatMessage.room).emit("new-receive", chatMessage);
  });

  socket.on("disconnect", () => {
    const userName = q;
    socket.leave(z);
    p = p.filter((item) => item !== userName);

    let useName = { "message": userName + " left the chat", "position": "right" };
    socket.to(z).emit("dist", useName);
  });
});

server.listen(8001);
