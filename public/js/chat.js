
const btnIcon = document.querySelector("[btn-icon]");
if(btnIcon){
    btnIcon.addEventListener("click",() => {
        const emojiPicker = document.querySelector('emoji-picker');
        emojiPicker.classList.toggle("d-none");
    })
}

// Handle Add Icon
document.querySelector('emoji-picker')
  .addEventListener('emoji-click', event =>{
    const input = document.querySelector('[form-send-message] input');
    input.value+=event.detail.unicode;
  });


// Handle Remove Image
function removeImage(e){
  const inputImageUpToServer = document.querySelector("[form-send-message] input[name='images']");
  const index = parseInt(e.target.getAttribute("index"));
  
  // Xoá image trong input up lên server
  const dt = new DataTransfer();
  let i=0;
  for(const file of inputImageUpToServer.files){
    if(i==index-1) continue;
    dt.items.add(file);    
  }
  inputImageUpToServer.files = dt.files;
  // end

  // Xoá image ở giao diện
  const parent = e.target.parentNode;
  parent.remove();
  //
}

// Handle Up ảnh
const inputUploadImage = document.querySelector("input#image");
if(inputUploadImage){
  inputUploadImage.addEventListener("change",() => {
    const imageContainer = document.querySelector(".message-images");
    const messageImages = document.querySelector(".message-images");
    const inputImageUpToServer = document.querySelector("[form-send-message] input[name='images']");

    const dt = new DataTransfer();
    for(const file of inputImageUpToServer.files){
      dt.items.add(file);
    }

    Array.from(inputUploadImage.files).forEach((item) => {
      dt.items.add(item);

      const urlVirtualImage = URL.createObjectURL(item);
      const messageImage = document.createElement("div");
      messageImage.classList.add("message-image");
      messageImage.classList.add("col-2");
      const img = document.createElement('img');
      img.setAttribute("src",urlVirtualImage);
      const button = document.createElement("button");
      button.innerText = "x";
      button.setAttribute("index",dt.items.length);
      button.addEventListener("click",removeImage);

      messageImage.appendChild(img);
      messageImage.appendChild(button);

      messageImages.appendChild(messageImage);
    })

    inputImageUpToServer.files = dt.files;
  })
}

// Handle thêm người dùng vào nhóm
const btnAddUser = document.querySelector("[btn-add-user]");
if(btnAddUser){
  btnAddUser.addEventListener("click",(e) => {
    const formAddUser = document.querySelector(".formCreateRoomChat");
    formAddUser.classList.remove("close");
  })
}

// Handle collpase
const openCollapses = document.querySelectorAll("[open-collapse]");
if(openCollapses.length > 0){
  openCollapses.forEach((item) => {
    item.addEventListener("click",(e) => {
      const icon = item.querySelector("i");
      const collapse = item.parentNode.querySelector(".collapse");

      collapse.classList.toggle("show");
      icon.classList.toggle("rotate");
    })
  })
}