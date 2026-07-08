
// Xử lý hiển thị chọn ảnh
// const formProfile = document.querySelector("[forn_drive]");
// if(formProfile){
//     formProfile.addEventListener("submit",(e) => {
//         console.log(e);
//     })
// }


const chooseImageProfile = document.querySelector("#profile-avatar");
if(chooseImageProfile){
    chooseImageProfile.addEventListener("change",(e) => {
        const file = e.target.files;
        const fakeUrl =  URL.createObjectURL(e.target.files[0]);
        const profileAvatar = document.querySelector(".profile-avatar");
        profileAvatar.setAttribute("src",fakeUrl);
    })
}