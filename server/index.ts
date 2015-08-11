var app = require("express")();
import * as socketIo from "socket.io";
import * as serveStatic from "serve-static";
import {createServer} from "http";
import {DockerLogs} from "./docker"

var server = createServer(app);
var io = socketIo(server);

app.use(serveStatic("public"));

io.on("connection", (socket) => {
    var docker = new DockerLogs();
    docker.on("stdout", (log) => socket.emit("stdout", log));
    docker.on("stderr", (log) => socket.emit("stderr", log));
});

server.listen(3000);

console.log("Listening on http://localhost:3000 ...");