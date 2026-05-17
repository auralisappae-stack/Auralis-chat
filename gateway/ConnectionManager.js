//connection Manager
//Responsible for tracking all connected users

class ConnectionManager {

    constructor() {

        //Map Stores active user connections
        this.connections = new Map()
    }

    addConnection(userid, socket) {

        this.connections.set(userid, socket)
        console.log('User ${userid} connected')
    }

    removeConnection(userid) {
        this.connections.delete(userid)
        console.log('user ${userid} disconnected')
    }

    getConnection(userid) {

        return this.connections.get(userid)
    }

    getonlineUser(){

        return Array.from(this.connections.keys())
    }
}

module.exports = new ConnectionManager()