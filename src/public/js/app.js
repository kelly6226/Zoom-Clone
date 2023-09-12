const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg); //JSON.stringify는 JavaScript object를 string으로 바꿔줌
}

//Backend에서 보낸 message를 받기
//아래는 socket이 connection을 open했을때 발생할 것
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

//아래는 서버로부터 받은 message가 있다면, 진행됨
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

//아래는 서버와의 connection이 끝났을때 발생할 것
socket.addEventListener("close", () => {
  console.log("Disconnected to Server ❌");
});

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.vaue)); //입력된 값들을 모두 백엔드로 넘겨주고 있음
  input.value = "";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.vaue));
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
