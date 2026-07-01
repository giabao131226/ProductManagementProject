// Change quantity product in cart
const btnQuantity = document.querySelectorAll("[btn-cart-quantity]");
if(btnQuantity.length > 0){
    btnQuantity.forEach((item) => {
        item.addEventListener("click",(e) => {
            const inputQuantity = document.querySelector("input[name='quantity']");
            const quantity = inputQuantity.value;
            const formChangeQuantity = document.querySelector("[form-change-quantity]");
            const input = formChangeQuantity.querySelector("[name='quantity']");
        })
    })
}
