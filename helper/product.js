
module.exports.formatMoney = (s) =>{
    const money = s.toString();
    if(money.length < 4) return money;
    const arr = [];
    let pos = 0;
    for(var i = money.length - 1;i>=0;i--){
        arr.push(money[i]);
        pos+=1;
        if(pos % 3 == 0 && i!=0) arr.push(",");
    }
    return arr.reverse().join("");
}