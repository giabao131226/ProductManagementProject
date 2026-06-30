
window.addEventListener("scroll",() => {
    const lastScrolly = 200;
    if(window.scrollY >= lastScrolly){
        const header = document.querySelector("header.header-client");
        header.classList.add("bg-white");
        const spanHeader = header.querySelectorAll(".text-header");
        if(spanHeader.length > 0){
            spanHeader.forEach((item) => item.style.color='black');
        }
    }else if(window.scrollY < lastScrolly){
        const header = document.querySelector("header.header-client");
        header.classList.remove("bg-white");
        const spanHeader = header.querySelectorAll(".text-header");
        if(spanHeader.length > 0){
            spanHeader.forEach((item) => item.style.color='white');
        }
    }
})

// Open search box
const btnOpenSeachBox = document.querySelector("[btn-open-search-box]")
if(btnOpenSeachBox){
    btnOpenSeachBox.addEventListener("click",(e) => {
        const activeSearch = document.querySelector(".active-search");
        const searchBox = document.querySelector(".search-box");
        if(activeSearch){
            searchBox.classList.add("d-none");
            btnOpenSeachBox.classList.remove("active-search");
            btnOpenSeachBox.classList.remove("text-blue-400");
        }else{
            searchBox.classList.remove("d-none");
            btnOpenSeachBox.classList.add("active-search");
            btnOpenSeachBox.classList.add("text-blue-400");
        }
    })
}

// Search Client
const formSearchClient = document.querySelector("[form-search-product]");
if(formSearchClient){
    formSearchClient.addEventListener("submit",(e) => {
        e.preventDefault();
        const keyword = e.target.querySelector("input").value;
        const action = e.target.action;
        const url = new URL(action);
        url.searchParams.set("keyword",keyword);
        console.log(url.href);
        window.location.href = url.href;
    })
}

// add product to cart
const btnAddCart = document.querySelector("[btn-add-cart]");
if(btnAddCart){
    btnAddCart.addEventListener("click",(e) => {
        const idProduct = e.target.getAttribute("id-product");
        const quantity = document.querySelector("input[name = 'quantity']").value;
        const formAdd = document.querySelector("[form-add-cart]");
        const inputQuantity = formAdd.querySelector("input[name='quantity']");
        const inputProductID = formAdd.querySelector("input[name='productID']");
        inputQuantity.value = parseInt(quantity);
        inputProductID.value = idProduct;
        formAdd.submit();
    })
}

// change-quantity-cart

