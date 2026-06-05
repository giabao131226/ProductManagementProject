

module.exports.autho = (permissions) => {
    return (req,res,next) => {
        const role = res.locals.role
        console.log(permissions);
        console.log(role.permissions);
        if(role.permissions.includes(permissions)){
            console.log("next");
            next();
        }else res.redirect("/admin/dashboard");
    }
}