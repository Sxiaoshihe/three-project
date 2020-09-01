const router=require('express').Router();
const db=require("./sqlHelper");
router.get("/",(req,res)=>{
    res.redirect("/index.html");
})
function getBanner(){
    return new Promise((resolve,reject)=>{
        let sql="select * from banner where keyName='lun'";
        db.query(sql,[],(err,data)=>{ 
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        })
    })
}
function getNewList(){
    return new Promise((resolve,reject)=>{
        let sql2="SELECT product.*,productRule.Id AS rid FROM Product JOIN  ProductRule ON Product.Id=ProductRule.productId WHERE isNew=1 AND isDefault =1;";
        db.query(sql2,[],(err,data)=>{ 
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        })
    })
}


router.get("/index.html",async (req,res)=>{
    let bannerList = await getBanner();
    let newList= await getNewList();
    if(req.session.user){
        res.render("index",{user:req.session.user,headImage:req.session.info.HeadImage,
            lunbo:bannerList,
            newList:newList
        });
    }else{
        res.render("index",{user:req.session.user,lunbo:bannerList,
            newList:newList
        });
    }
    // getBanner().then((data)=>{
    //     bannerList=data;
    //     return getNewList();
    // }).then((data)=>{
    //     newList=data;
       
    // })
    // let sql="select * from banner where keyName='lun'";
    // db.query(sql,[],function(err,data){
    //     let sql2="SELECT product.*,productRule.Id AS rid FROM Product JOIN  ProductRule ON Product.Id=ProductRule.productId WHERE isNew=1 AND isDefault =1;"
    //     db.query(sql2,[],function(err2,data2){
    //         if(req.session.user){
    //             res.render("index",{user:req.session.user,headImage:req.session.info.HeadImage,
    //                 lunbo:bannerList,
    //                 newList:newList
    //             });
    //         }else{
    //             res.render("index",{user:req.session.user,lunbo:bannerList,
    //                 newList:newList
    //             });
    //         }
    //     })
    // });
    
})
router.get("/product.html",(req,res)=>{
    res.render("product")
})
router.get("/user.html",(req,res)=>{
    let sql="select * from user";
    db.query(sql,[],function(err,data){
        res.render("user",{userList:data})
    });
})
router.get("/productDetail.html",(req,res)=>{
    let rid=req.query.id;
    let sql='SELECT *,r.Id AS rid FROM product p JOIN productRule r ON p.Id=r.productId WHERE r.Id=?;'
    db.query(sql,[rid],function(err,data){
        res.render('productDetail',{info:data[0],user:req.session.user,
        headImage:req.session.headImage
        });
    })
    
})
router.get("/cart.html",(req,res)=>{
    if(req.session.user){
        let userId=req.session.info.id;
        let sql=`SELECT s.id as sid, p.feng,p.title,r.price,s.num,r.Id AS rid FROM shopcart s JOIN productrule r 
        ON s.RuleId = r.Id JOIN product p
         ON r.productId=p.Id where s.userid=?`;
        db.query(sql,[userId],(err,data)=>{
            res.render('cart',{user:req.session.user,headImage:req.session.headImage,productList:data})
        }) 
    }else{
        res.redirect("/index.html");
    }
})
module.exports=router;
