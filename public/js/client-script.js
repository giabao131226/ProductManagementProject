
window.addEventListener("scroll",() => {
    if(window.scrollY >= 10){
        const header = document.querySelector("header.header-client");
        header.classList.add("bg-white");
        header.classList.add("text-black");
        const spanHeader = header.querySelectorAll(".text-white");
        if(spanHeader.length > 0){
            spanHeader.forEach((item) => item.classList.remove("text-white"));
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
        const formAdd = document.querySelector("[form-add-cart]");
        const action = formAdd.action + "/"+idProduct;
        formAdd.action = action;
        console.log(formAdd.action);
        formAdd.submit();
    })
}