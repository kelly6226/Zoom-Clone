import http from "http";
import { WebSocketServer } from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug"); // view engine 설정
app.set("views", __dirname + "/views"); // views 폴더 설정

app.use("/public", express.static(__dirname + "/public")); // frontend 구동과 관련된 public 폴더 (css, js)

app.get("/", (_, res) => res.render("home")); // 라우팅
app.get("/*", (_, res) => res.render("home"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function onSocketClose() {
  console.log("Disconnected from the Browser ❌");
}

//누군가 우리 서버에 연결하면, 해당 connection을 여기 배열에 저장
const sockets = [];

//connection이 생겼을때, socket으로 즉시 메세지를 보내준 것
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon"; //이렇게 socket안에 데이터를 저장할 수 有
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", (msg) => {
    const message = JSON.parse(msg); //string을 Javascript object로 바꿔줌

    switch (message.type) {
      case "new_message":
        // 만약에 message가 new_message라면
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});

server.listen(3000, handleListen);
