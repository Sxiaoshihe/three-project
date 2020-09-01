/**
 * Created by lenovo on 2020/8/25.
 */
// 
const express=require('express');
const favicon=require('serve-favicon');  
const logger=require('morgan');   //日志
const bodyparser=require('body-parser');   //post
const cookieParser=require("cookie-parser");  //cookie
const session = require('express-session');
const ejs=require( 'ejs') ;//引入ejs
const userRouter=require("./router/userRouter");
const viewPouter=require("./router/viewRouter");
const productRouter=require("./router/productRouter");
const app=express();  //

app.use(logger('dev'));  

app.use(cookieParser());
app.use(session({
    secret:'1234',
    name:'testapp',//这里的name值得是cookie的name，默认cook ie的name是: connect.sid
    cookie:{maxAge: 800000 },// 设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    rolling: true,   //更新session-cookie失效时间
    resave: true ,
    //,   //重新保存
    saveUninitialized: true
    }));
    //定义ejs模板引擎和模板文件位置
app.set ('views',__dirname+'/view');
app.engine("html",ejs.__express);
app.set ('view engine','html') ;   //配置视图引擎
app.use(favicon(__dirname+'/public/favicon.ico.jpg'));  //图标
app.use(bodyparser.json());         //post
app.use(bodyparser.urlencoded({
    extended:false
}));
app.use(userRouter);  //路由
app.use(viewPouter); 
app.use(productRouter);
app.use(express.static(__dirname+'/public')); //静态资源



app.listen(9999);
console.log("服务启动");