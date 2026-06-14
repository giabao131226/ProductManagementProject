const ProductCategory = require("../../models/product-category.model");
const createTree = require("../../helper/createTree");

module.exports.getCategory = async (req,res,next) => {
    try{
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
        const productCategory = await ProductCategory.find().lean();
        const treeCategory = createTree(productCategory,'');
        res.locals.treeCategory = treeCategory;
        next();
    }catch(error){
        console.log("Lỗi khi lấy danh mục sản phẩm: "+error);
    }
}