const WebSocket = require("ws");
const fs = require("fs");

const wss = new WebSocket.Server({ port: 3000 });

console.log("Server running on port 3000");

// ===== USERS FILE =====
const USERS_FILE = "users.json";

function getUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ===== AUTH =====
function login(username, password) {
  const users = getUsers();

  const user = users.find(u => u.username === username);
  if (!user) return { error: "User not found" };

  if (user.password !== password) {
    return { error: "Incorrect password" };
  }

  return { success: true, username };
}

function signup(username, password) {
  const users = getUsers();

  const exists = users.find(u => u.username === username);
  if (exists) return { error: "Username already taken" };

  users.push({ username, password });
  saveUsers(users);

  return { success: true, username };
}

// ===== CHAT SYSTEM =====
let clients = [];

function broadcast(room, data) {
  clients.forEach(client => {
    if (client.room === room) {
      client.ws.send(JSON.stringify(data));
    }
  });
}

function updateUserList(room) {
  const users = clients
    .filter(c => c.room === room)
    .map(c => c.username);

  broadcast(room, {
    type: "user-list",
    users
  });
}

// ===== CONNECTION =====
wss.on("connection", (ws) => {
  let currentUser = null;

  ws.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch {
      return;
    }

    // ===== AUTH =====
    if (data.type === "login") {
      const result = login(data.username, data.password);

      ws.send(JSON.stringify({
        type: "auth",
        ...result
      }));
    }

    if (data.type === "signup") {
      const result = signup(data.username, data.password);

      ws.send(JSON.stringify({
        type: "auth",
        ...result
      }));
    }

    // ===== JOIN ROOM =====
    if (data.type === "join") {
      currentUser = {
        ws,
        username: data.user,
        room: data.room
      };

      clients.push(currentUser);

      broadcast(data.room, {
        type: "user-joined",
        user: { name: data.user },
        room: data.room
      });

      updateUserList(data.room);
    }

    // ===== MESSAGE =====
    if (data.type === "message") {
      if (!currentUser) return;

      broadcast(currentUser.room, {
        type: "message",
        user: { name: currentUser.username },
        data: data.data,
        room: currentUser.room
      });
    }

    // ===== SWITCH ROOM =====
    if (data.type === "switch-room") {
      if (!currentUser) return;

      // remove from old room
      broadcast(currentUser.room, {
        type: "user-left",
        user: { name: currentUser.username }
      });

      currentUser.room = data.room;

      broadcast(currentUser.room, {
        type: "user-joined",
        user: { name: currentUser.username },
        room: data.room
      });

      updateUserList(currentUser.room);
    }
  });

  ws.on("close", () => {
    if (!currentUser) return;

    clients = clients.filter(c => c !== currentUser);

    broadcast(currentUser.room, {
      type: "user-left",
      user: { name: currentUser.username }
    });

    updateUserList(currentUser.room);
  });
});