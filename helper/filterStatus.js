
module.exports = (search,listButton,query) => {
    const status = search.status

    if(status){
        query.active = status
        if(status=="active") listButton[1].class = "active"
        else listButton[2].class = "active"
    }else listButton[0].class = "active"

}