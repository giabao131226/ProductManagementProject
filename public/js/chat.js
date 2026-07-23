
const btnIcon = document.querySelector("[btn-icon]");
console.log(btnIcon);
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