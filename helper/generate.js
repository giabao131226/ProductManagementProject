
module.exports.generateRandomString = (length) => {
    const char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let ans = "";
    for(var i = 0;i<length;i++){
        ans+=char[Math.floor(Math.random()*char.length)];
    }
    return ans;
}