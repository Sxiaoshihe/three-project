const router=require('express').Router();
const db=require("./sqlHelper");
router.post("/shopcart",(req,res)=>{
    var rid=req.body.rid;
    if(req.session.user){
        let userId=req.session.info.id;
        //判断是否有 有就+1
        let sql2="select * from shopcart where UserId=? and ruleId=?"
        db.query(sql2,[userId,rid],(err2,data2)=>{
            if(err2){
                console.log(err2);
                // res.send({code:500,message:"数据库出错"});
            }else{
                if(data2.length>0){
                    let sql="update shopcart set num=num+1 where UserId=? and ruleId=?"
                    db.query(sql,[userId,rid],(err,data)=>{
                        if(err){
                            res.send({code:500,message:"数据库出错11"});
                        }else{
                            if(data.affectedRows>0){
                                res.send({code:200,message:"加入成功"});
                            }else{
                                res.send({code:202,message:"加入失败"});
                            }
                        }
                    })
                }else{
                    let sql="INSERT INTO shopcart(UserId,RuleId) VALUES(?,?)"
                    db.query(sql,[userId,rid],(err,data)=>{
                        if(err){
                            res.send({code:500,message:"数据库出错22"});
                        }else{
                            if(data.affectedRows>0){
                                res.send({code:200,message:"加入成功"});
                            }else{
                                res.send({code:202,message:"加入失败"});
                            }
                        }
                    })
                }
            }
        })
       
    }else{
        res.send({code:201,message:"请先登录"})
    }
})
router.post("/buildOrder",(req,res)=>{
    let sidStr= req.body.sidstr;
    let total=req.body.total;
    //生成订单
    if(req.session.user){
        let userid=req.session.info.id;
        let sql="insert into `orders` (userid,total) values(?,?)";
        db.query(sql,[userid,parseFloat(total)],(err,data)=>{
            if(err){
                res.send({code:500,message:"服务器出错1"})
            }else{
                if(data.affectedRows>0){
                   let orderId=data.insertId;
                   //插入订单详情
                    let sql2=`INSERT INTO orderdetail(orderId,ruleId,num,price) 
                    SELECT ${orderId},s.RuleId,s.num,r.price 
                   FROM shopcart s JOIN productrule r 
                   ON s.RuleId = r.Id 
                   WHERE s.id IN (${sidStr})`;
                    db.query(sql2,[],(err2,data2)=>{
                        if(err2){
                            res.send({code:500,message:"服务器出错2"})
                        }else{
                            //删除购物车信息
                            let sql3=`delete from shopcart where id in (${sidStr})`;
                            db.query(sql3,[],(err3,data3)=>{
                                if(err3){
                                    res.send({code:500,message:"服务器出错3"})
                                }else{
                                    res.send({code:200,message:"订单生成成功，跳转到订单详情页"})
                                }
                            })
                        }

                    })
                    
                }else{
                    res.send({code:202,message:"插入失败"})
                }
            }
        })
    }else{
        res.send({code:201,message:"请先登录"})
    }
    

})



module.exports=router;