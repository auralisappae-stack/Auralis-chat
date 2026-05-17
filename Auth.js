const fs = require("fs");

const FILE = "./users.json";

//load users
function getUsers() {
    return JSON.parse(fs.readFileSync(FILE));
}

//save users
function saveUsers(users) {
    fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
}

//sign up

function signup(username, password) {
    const users = getUsers();

    const exists = users.find(u => u.username === username);


    if (exists) {
        return {error: "Username alreadu taken"};
    }

    users.push({ username, password });
    saveUsers(users);


    return { success: true, username };
}
    

//login

function login(username, password) {
    const users = getUsers();

    const user = users.find(u => u.username === username && u.passwprd === password);

    if (!user) {
        return { error: "User not Found"};
    }

    if (user.password !== password) {
        return { error: "Incorrect password" };
    }

    return { success: true,username };
}

module.exports = {signup, login };