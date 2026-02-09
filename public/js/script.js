
const handleClick = (e) => {
    e.preventDefault();

    const url = new URL(window.location.href)
    const active = e.target.getAttribute("active")

    if (active == "active") url.searchParams.set("status", active)
    else if (active == "inactive") url.searchParams.set("status", active)
    else url.searchParams.delete("status")

    window.location.href = url.href

}

const listButton = document.querySelectorAll(".buttonDefault")

listButton.forEach((item) => {
    item.addEventListener("click", handleClick)
})
// Search
const formSearch = document.querySelector("#form-search")

if (formSearch) {
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = e.target.keyword.value

        const url = new URL(window.location.href)

        if (value) {
            url.searchParams.set("keyword", value)
        }

        window.location.href = url.href

    })
}
// End search
// Pagination

const buttonPagination = document.querySelectorAll("[button-pagination]")
buttonPagination.forEach((item) => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        const page = e.target.getAttribute("button-pagination")

        const url = new URL(window.location.href)

        url.searchParams.set("page", page)

        window.location.href = url.href

    })
})

// End Pagination

// ChangeStatus
const changeStatus = document.querySelectorAll("[button-status]")

changeStatus.forEach((item) => {
    item.addEventListener("click", (e) => {
        const status = e.target.getAttribute("button-status")
        const id = e.target.getAttribute("id-element")

        const form = document.querySelector("#form-changeStatus")

        form.action = `/admin/products/change-status/${status}/${id}?_method=PATCH`
        form.submit()
    })
})
// End Change Status
const checkboxMulti = document.querySelector("[checkbox-multi]")
if (checkboxMulti) {
    const inputCheckAll = document.querySelector("#changeStatusAll")
    const inputChangeStatus = document.querySelectorAll("input[name='id']")
    const maxChecked = 4;

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputChangeStatus.forEach((item) => {
                item.setAttribute("checked", "true")
            })
        } else {
            inputChangeStatus.forEach((item) => {
                item.removeAttribute("checked")
            })
        }
    })

    inputChangeStatus.forEach((item) => {
        item.addEventListener("click", () => {
            if (item.checked) {
                item.setAttribute("checked", "true")
            } else item.removeAttribute("checked")

            const soLuongChecked = document.querySelectorAll("input[value][checked]")
            if (soLuongChecked.length === maxChecked) {
                inputCheckAll.setAttribute("checked", "true")
            } else inputCheckAll.removeAttribute("checked")
        })
    })

}


// Change Multi
const formChangeMulti = document.querySelector("#form-change-multi")
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")

        if (inputsChecked.length) {
            const ids = []
            inputsChecked.forEach((item) => {
                ids.push(item.value)
            })

            const inputSubmit = formChangeMulti.querySelector("input[name='ids']")
            inputSubmit.value = ids.join(",")
            formChangeMulti.submit();
        } else console.log("Bạn phải tích đủ các trường cần thiết")

    })
}
// End Change Multi