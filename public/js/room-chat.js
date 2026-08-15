
const formCreateRoomChat = document.querySelector("[form-create-room]");
if(formCreateRoomChat){
    const btnSearch = formCreateRoomChat.querySelector(".tool [btn-search]");
    btnSearch.addEventListener("click",(e) => {
        const input = btnSearch.previousElementSibling;
        const formSearch = document.querySelector("[form-create-room-search]");
        const inputSearch = formSearch.querySelector("input");
        inputSearch.value = input.value;
        formSearch.submit();
    })


    // handle tắt form
    const btnCloseForm = document.querySelector("[btn-close-form]");
    if(btnCloseForm){
        btnCloseForm.addEventListener("click",(e) => {
            formCreateRoomChat.parentNode.classList.add("close");
        })
    }

    // hanlde bật form
    const btOpenForm = document.querySelector("[btn-create-room-chat]");
    if(btOpenForm){
        btOpenForm.addEventListener("click",(e) => {
            formCreateRoomChat.parentNode.classList.remove("close");
        })
    }

    // // handle tìm kiếm
    // const btnSearch = formCreateRoomChat.querySelector("[btn-search]");
    // if(btnSearch){
    //     btnSearch.addEventListener("click",(e) => {
    //         const formSearch = formCreateRoomChat.querySelector("[form-create-room-search]");
    //         const inputFormSearch = formSearch.querySelector("input");

    //         const inputPrevious = btnSearch.previousElementSibling;
    //         console.log(inputPrevious);
    //     })
    // }
}

