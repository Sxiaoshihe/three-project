const mysql=require("mysql");
function DbHeiper(sql,param,callback){
    const conn=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        port:3306,
        database:'shop'
    })
    conn.connect();   
    conn.query(sql,param,callback);
    conn.end();
}
//暴露文件
module.exports={
    query:DbHeiper
};