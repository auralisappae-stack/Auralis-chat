const express = require("express")
const http = require("http")
const WebSocket = require("ws")
const connectionManager = require("./connectionManager")

// create express application
const app = express()

// create http server
const server = http.createServer(app)

// create websocket server
const wss = new WebSocket.Server({ server })

// connection event
wss.on("connection", (ws) => {

    const userId = Math.floor(Math.random() * 100000)

    connectionManager.addConnection(userId, ws)

    ws.on("message", (data) => {

        console.log('essage from ${userId}:', data.toString())

    })

    ws.on("close", () => {

        connectionManager.removeConnection(userId)

    })
})

// start the server
server.listen(3000, () => {

    console.log("Auralis Gateway running on port 3000")

})