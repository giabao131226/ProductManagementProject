
module.exports = (search,query) => {
    const keyword = search.keyword

    if(keyword){
        const regex = new RegExp(keyword)
        query.title = regex
    }
}