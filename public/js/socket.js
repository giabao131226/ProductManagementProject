
var socket = io();

const formSendMessage = document.querySelector("[form-send-message]");
if(formSendMessage){
    formSendMessage.addEventListener("submit",(e) => {
        e.preventDefault();
        const msg = e.target.querySelector("input").value;
        socket.emit("CLIENT_SEND_MESSAGE",msg);
    })
}

socket.on("SERVER_RETURN_MESSAGE",(respone) => {
    const chatBody = document.querySelector("#chatBody");
    const msgElement = document.createElement("div");
    msgElement.classList.add("message");
    const bubbleElement = document.createElement("div");
    bubbleElement.classList.add("bubble");
    bubbleElement.innerHTML = respone.content;
    msgElement.appendChild(bubbleElement);
    const userIdCurrent = document.querySelector("[user_id]").getAttribute("user_id");
    if(respone["user_id"] == userIdCurrent){
        msgElement.classList.add("right");
    }else msgElement.classList.add("left");
    chatBody.appendChild(msgElement);
})