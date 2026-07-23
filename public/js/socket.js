
var socket = io();
const bodyChat = document.querySelector(".chat-body");
bodyChat.scrollTop = bodyChat.scrollHeight;

const formSendMessage = document.querySelector("[form-send-message]");
if(formSendMessage){
    formSendMessage.addEventListener("submit",(e) => {
        e.preventDefault();
        const input = e.target.querySelector("input")
        if(input.value.trim() == "") return;
        const msg = input.value;
        input.value = "";
        socket.emit("CLIENT_SEND_MESSAGE",msg);
    })
}


socket.on("SERVER_RETURN_MESSAGE",(respone) => {
    const chatBody = document.querySelector("#chatBody");
    const rowChat = document.createElement("div");
    rowChat.classList.add("d-flex");
    rowChat.classList.add("flex-column");

    const msgElement = document.createElement("div");
    msgElement.classList.add("message");

    const bubbleElement = document.createElement("div");
    bubbleElement.classList.add("bubble");
    bubbleElement.innerHTML = respone.content;

    const userIdCurrent = document.querySelector("p[user_id]").getAttribute("user_id");
    if(respone["user_id"] == userIdCurrent){
        msgElement.classList.add("right");
    }else{
        msgElement.classList.add("left");
        msgElement.classList.add("d-flex");
        msgElement.classList.add("items-center");
        msgElement.classList.add("gap-x-1");

        const userNameElement = document.createElement("p");
        userNameElement.classList.add("userName");
        userNameElement.innerHTML = respone.userName;
        rowChat.appendChild(userNameElement);

        const avatarElement = document.createElement("img");
        avatarElement.classList.add("avatar");
        avatarElement.setAttribute("src",respone.avatar);

        msgElement.appendChild(avatarElement);
    }
    msgElement.appendChild(bubbleElement);
    rowChat.appendChild(msgElement);
    const typing = chatBody.querySelector(".chat-typing");
    chatBody.insertBefore(rowChat,typing);
    typing.classList.add("d-none");
    console.log(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
})

// Handle Typing
const inputMessage = document.querySelector("input#message");
if(inputMessage){
    inputMessage.addEventListener("input",() => {
        socket.emit("CLIENT_TYPE_MESSAGE","show");
    })
}
let timeOutHideTyping;
socket.on("SERVER_SEND_ATT_TYPE_MESSAGE",(att) => {
    const typing = bodyChat.querySelector(".chat-typing");
    if(att == "show") typing.classList.remove("d-none");
    clearTimeout(timeOutHideTyping);
    timeOutHideTyping = setTimeout(() => {
        typing.classList.add("d-none");
    },3000);
    bodyChat.scrollTop = bodyChat.scrollHeight;
})