
const btnUpdate = document.querySelector("[btn-update-role]");
if(btnUpdate){
    btnUpdate.addEventListener("click",(e) => {
        const permissions = []
        const idPermission = document.querySelectorAll("tr[id-permissions] th[id-value]");
        idPermission.forEach((item) => {
            permissions.push({
                "id": item.getAttribute("id-value"),
                "permissions": []
            })
        })
        const listPermission = document.querySelectorAll("tbody tr[permission]");
        listPermission.forEach((item) => {
            const inputs = item.querySelectorAll("input");
            const quyen = item.getAttribute("permission");
            inputs.forEach((input,index) => {
                if(input.checked){
                    permissions[index].permissions.push(quyen);
                }
            })
        })

        const formUpdate = document.querySelector("[form-update-permissions]");
        const inputForm = formUpdate.querySelector("input");
        inputForm.value = JSON.stringify(permissions);
        formUpdate.submit();
    })
}

const roles = JSON.parse(document.querySelector("div[roles]").getAttribute("roles"));
if(roles.length > 0){
    roles.forEach((item,index) => {
        const permissions = item.permissions;
        permissions.forEach((item) => {
            const inputs = document.querySelectorAll(`[permission = ${item}] input`);
            inputs[index].checked = true;
        })
    })
}
