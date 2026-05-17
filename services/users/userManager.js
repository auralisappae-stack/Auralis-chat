class Usermanager {
    constructor(){
        this.users = new Map();
    }

    addUser(ws) {
        const userid = this.generateId();

        const user = {
            id: uderid,
        socket: ws,
        room: null
        };
        this.users.set(userid,user);

        console.log("User connected:", userid);

        return user;
    }

    removeUser(userid) {
        if (this.users.has(userid)) {
            this.users.delete(userid);
            console.log("User removed:", userid);
        }
    }

    getUser(userid) {
        return this.users.get(userid);
    }

    getAllUsers() {
        return Array.from(this.users.values());
    }

    generateid() {
        return Math.random().toString(36).substring(2, 10);
    }
}

module.exports = new Usermanager();