const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const create = require("./practice");
const add = require("./add");
const check = require("./check");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const users = {};

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

io.on("connection", async (socket) => {
    socket.on("new-user", async (w) => {
        const { name, room, pass } = w;
        let l = 0;
        let a1 = await check();
        
        if (a1) {
            a1.forEach((item) => {
                if (name === item) {
                    l = 1;
                }
            });
        }

        if (l === 1) {
            socket.join(room);
            let data = await add.get_data(name, room);
            users[socket.id] = name;
            io.to(socket.id).emit("lost", data);
            io.to(room).emit("userjoined", { message: name + " joined", position: "right" });
        } else {
            socket.join(room);
            await create(name);
            await add.add_data(name, pass);
            users[socket.id] = name;
            let data = await add.get_data(name, room);
            io.to(socket.id).emit("lost", data);
            io.to(room).emit("userjoined", { message: name + " joined", position: "right" });
        }
    });

    socket.on("login", async (aw) => {
        const { email, pass, room } = aw;
        let user = await add.getUser(email);
        
        if (user && user.password === pass) {
            socket.emit("ok", true);
            let data = await add.get_data(email, room);
            io.to(socket.id).emit("lost", data);
        } else {
            socket.emit("fail", false);
        }
    });

    socket.on("send", async (message) => {
        const { data, message: msg, room } = message;
        const name = users[socket.id];
        const position = "left";
        data.forEach(async (item) => {
            await add.add_message(name, item, msg, room, position);
        });
        io.to(room).emit("new-receive", { data, message: msg, name, room, position });
    });

    socket.on("disconnect", () => {
        const userName = users[socket.id];
        const room = Object.keys(socket.rooms).find(room => room !== socket.id); // Get room
        socket.leave(room);
        users[socket.id] = null;
        io.to(room).emit("dist", { message: userName + " left the chat", position: "right" });
    });
});

server.listen(8001, () => {
    console.log("Server is running on port 8001");
});
