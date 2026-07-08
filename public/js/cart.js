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


// Xử lý check 
const inputCheckAll = document.querySelector("[name='check-all']");
if(inputCheckAll){
    inputCheckAll.addEventListener("click",(e) => {
        const trs = document.querySelectorAll("tr[product-id]");
        if(inputCheckAll.checked){
            trs.forEach((item) =>{
                const inputCheck = item.querySelector("input[type='checkbox']");
                inputCheck.checked = true;
            });
        }else{
                trs.forEach((item) =>{
                    const inputCheck = item.querySelector("input[type='checkbox']");
                    inputCheck.checked = false;
                });
        }
    })
}
