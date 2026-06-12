

module.exports.autho = (permissions) => {
    return (req,res,next) => {
        const role = res.locals.role
        if(role.permissions.includes(permissions)){
            next();
        }else res.redirect("/admin/dashboard");
    }
}