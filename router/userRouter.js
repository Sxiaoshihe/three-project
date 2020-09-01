/**
 * Created by lenovo on 2020/8/20.
 */
const router=require('express').Router();
const db=require("./sqlHelper");
router.post("/userLogin",(req,res)=>{
    let user=req.body.user;
    let pwd=req.body.pwd;
    let sql="select * from user where username=? and pwd=?";
    db.query(sql,[user,pwd],function(err,data){
        if(err){
            res.send({code:500,message:"数据库出错"})
        }else{
            if(data.length>0){
                req.session.user=user;  //存用户名
                req.session.headImage=data[0].HeadImage;  //存头像
                req.session.info=data[0];   //存整条数据
                console.log("login");
                console.log(req.session.user);
                res.send({code:200,message:"登录成功",data:data})
            }else{
                res.send({code:201,message:"用户或密码出错"});
            }
        }
    })
})
router.post("/reg",(req,res)=>{
    let email=req.body.Email;
    let user=req.body.user;
    let pwd =req.body.zhucePwd;
    let sql="insert into user (username,pwd,email) values(?,?,?)"  
    db.query(sql,[user,pwd,email],function(err,data){
        if(err){
            res.send("数据库出错");
        }else{
            if(data.affectedRows>0){
                res.send("注册成功");
            }else{
                res.send("注册失败");
            }
        }
    })
})


module.exports=router;    