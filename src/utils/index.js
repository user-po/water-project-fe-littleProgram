function setCookie(key,value,t){
    var oDate=new Date();
    oDate.setDate(oDate.getDate()+t);
    document.cookie=key+"="+value+"; expires="+oDate.toDateString();
}
/**
 * [getCookie 获取cookie]
 */
function getCookie(cname){
  
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
/**
 * [removeCookie 移除cookie]
 */
function removeCookie(key){
    setCookie(key,"",-1); // 把cookie设置为过期
}
const formMateDate = (datetime)=>{
    var date = new Date(datetime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var year = date.getFullYear(),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        sdate = ("0" + date.getDate()).slice(-2),
        hour = ("0" + date.getHours()).slice(-2),
        minute = ("0" + date.getMinutes()).slice(-2),
        second = ("0" + date.getSeconds()).slice(-2);
    // 拼接
    var result = year + "-"+ month +"-"+ sdate +" "+ hour +":"+ minute +":" + second;
    // 返回
    return result;
}

export{
    setCookie,
    getCookie,
    removeCookie,
    formMateDate
}