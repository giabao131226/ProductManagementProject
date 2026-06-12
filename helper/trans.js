
module.exports.changeObjectToString = (data) => {
    return Object.entries(data).map(([key,value]) => `${key}: ${value}`).join(",");
}