
var socket = io();
const bodyChat = document.querySelector(".chat-body");
// bodyChat.scrollTop = bodyChat.scrollHeight;

// Handle Send Message
const formSendMessage = document.querySelector("[form-send-message]");
if(formSendMessage){
    formSendMessage.addEventListener("submit",(e) => {
        e.preventDefault();
        const input = e.target.querySelector("input#message");
        const inputImage = e.target.querySelector("input[name='images']");
        if(input.value.trim() == "" && inputImage.files.length == 0) return;
        const msg = {
            "content": input.value,
            "images": [...inputImage.files]
        };
        // Handle Add tin nhắn vừa gửi
        bodyChat.innerHTML += `<div class="message">
            <div class="right">
                <div class="message-main">
                    <div class="message-top">
                        <div class="d-flex flex-column items-start">
                            <div class="bubble">${input.value}</div>
                        </div>
                    </div>
                    <div class = "message-bottom">
                    ${inputImage.files.length > 0 ?
                        Array.from(inputImage.files).map((item) => `<div class="image">
                            <img src = "${URL.createObjectURL(item)}"></img>
                        </div>`)
                        : ""}
                    </div>
                </div>
            </div>
        </div>`
        // 
        input.value = "";
        const messageImages = document.querySelector(".message-images");
        messageImages.innerHTML = "";
        // socket.emit("CLIENT_SEND_MESSAGE",msg);
    })
}

socket.on("SERVER_RETURN_MESSAGE",(respone) => {

    // div.d-flex.flex-column
    //     p.userName(class = (chat["user_id"]._id.toString() == user._id.toString() ? "d-none" : "")) #{chat.user_id.fullName}
    //     div(class = (chat["user_id"]._id.toString() == user._id.toString() ? "right" : "left")).message
    //     .d-flex.flex-column(class = chat["user_id"]._id.toString() == user._id.toString() ? "items-end" : "")
    //         .d-flex.items-center.gap-x-1
    //         img(src = chat.user_id.avatar).avatar
    //         .bubble #{chat.content}
    //         - if(chat.images.length > 0)
    //             each url in chat.images
    //             img(
    //                 class = "image" 
    //                 src = url)

    console.log(respone);
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