const registerFriend = require("./users.socket");
const registerChat = require("./chat.socket");

module.exports = () => {
    _io.on("connection",(socket) => {
        registerFriend(socket);
        registerChat(socket);
    })
}