const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:3000");

const user = {
  name: "Lilith",
  room: "lobby"
};

ws.onopen = () => {
  console.log("Connected");

  ws.send(JSON.stringify({
    type: "join",
    user: user.name,
    room: user.room
  }));
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === "message") {
    console.log(`[${msg.room}] ${msg.user.name}: ${msg.data}`);
  }

  if (msg.type === "user-joined") {
    console.log(`🟢 ${msg.user.name} joined ${msg.room || ""}`);
  }

  if (msg.type === "user-left") {
    console.log(`🔴 ${msg.user.name} left`);
  }
};

// send message
function sendMessage(text) {
  ws.send(JSON.stringify({
    type: "message",
    data: text
  }));
}

// switch room
function switchRoom(roomName) {
  ws.send(JSON.stringify({
    type: "switch-room",
    room: roomName
  }));
}

// TEST FLOW
setTimeout(() => sendMessage("Hello lobby"), 2000);
setTimeout(() => switchRoom("gaming"), 4000);
setTimeout(() => sendMessage("Hello gaming room 🎮"), 6000);