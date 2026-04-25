// src/server.js
require("dotenv").config();
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

global.io = io; // 👈 disponible en todo el backend

io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);
});

server.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});