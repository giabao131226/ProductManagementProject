
const imageView = document.querySelectorAll(".message-bottom img");
imageView.forEach((item) => {
    new Viewer(item,{
    hidden() {
        document.body.focus();
    }
});
})
