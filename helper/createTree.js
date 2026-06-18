
function createTree(arr,parentID){
    const tree = [];
        arr.forEach((item) => {
            if(item.parent_id == parentID){
                const currentNode = {...item};
                const children = createTree(arr,item._id);
                if(children.length > 0){
                    currentNode.children = children;
                }
                tree.push(currentNode);
            }
        })
    return tree;
}
module.exports.getTree = (arr,parentID) =>{
    return createTree(arr,parentID);
}