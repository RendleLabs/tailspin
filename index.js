var app = require("express")();
var socketIo = require("socket.io");
var serveStatic = require("serve-static");
var http_1 = require("http");
var docker_1 = require("./docker");
var server = http_1.createServer(app);
var io = socketIo(server);
app.use(serveStatic("public"));
io.on("connection", function (socket) {
    var docker = new docker_1.DockerLogs();
    docker.on("stdout", function (log) { return socket.emit("stdout", log); });
    docker.on("stderr", function (log) { return socket.emit("stderr", log); });
});
server.listen(3000);
console.log("Listening on http://localhost:3000 ...");
