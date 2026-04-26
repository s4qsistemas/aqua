import "dotenv/config";
import http from "http";
import app from "./app";
import { Server } from "socket.io";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// NUEVO: Inyectamos Socket.io dentro de Express en lugar de usar variables globales
app.set("io", io);

io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});