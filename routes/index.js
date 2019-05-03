var express = require('express');
var router = express.Router();
var db = require('diskdb');
var sqldb = require('./db.js');
var authenticationMiddleware = require('./auth.js');
db.connect('DB', ['loginDB']);

//modules
var logIn = require('./models/login');
var signUp = require('./models/signup');
var sendMoney= require('./models/sendMoney');
let reciveMoney = require('./models/resivemoney');

//global declarations
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!

var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}
today = dd + '/' + mm + '/' + yyyy;
global.date=today;

/* GET home page. */
router.get('/', function(req, res) {
    // console.log(loged);
    res.render('login', { title: 'PayArk',msg:null});
});

router.post('/',(req,res)=>{
    logIn(req,res,(err,result)=>{
        if(err){
            res.render('login',{msg:err.msg,title:err.title});

        }else {
            res.redirect(result);
        }
    })
});

router.get("/sql",(req,res)=>{
    res.render('general/sqlrunner',{title:'SQL Query Runner',sql:'',q:'',errors:'',out:''});
});

router.post('/sql',(req,res)=>{
    var q=req.body.queries;
    sqldb.all(q,function(err,output){
        res.render("general/sqlrunner",{title:'SQL Query Runner',"sql":q,errors:err,out:output});
    });
});

router.get('/signup',(req,res)=>{
    res.render('signup',{title:'Sign Up',error:null})
});

router.post('/signup',(req,res)=>{
    signUp(req,(err,result)=>{
        if(err){
            res.render('signup',{error:err.error,title:err.title});
        }else{
            res.redirect('login',{msg:result.msg,title:result.title});
        }
    });
});

router.get('/home',authenticationMiddleware(),(req,res)=>{
    res.render('general/home',{title: 'Home',user:req.session.userName})
});

router.get('/user',authenticationMiddleware(),(req,res)=>{
    sqldb.all('select * from users where id = ?',[req.session.userId],(err,out)=>{
        if(err){
            console.log(err)
        }else{
            console.log(out[0]);
            res.render('general/userpage',{title:'You',user:req.session.userName,you:out[0]});
        }
    });
});

router.get('/transactions',authenticationMiddleware(),(req,res)=>{
    sqldb.all('select * from transactions where id=?',[req.session.userId],(error,output)=>{
        if(error){
            console.log(error);
        }else{
            console.log(output);
            res.render('general/transactions',{title:'Transactions',user:req.session.userName,list:output});
        }
    });
});

router.get('/receipts',authenticationMiddleware(),(req,res)=>{
    sqldb.all('select * from transactions where id=?',[req.session.userId],(error,output)=> {
        if (error) {
            console.log(error);
        } else {
            res.render('general/receipts', {title: 'Receipts', user: req.session.userName,list:output});
        }
    });
});

router.get('/receive-money',authenticationMiddleware(),(req,res)=>{
    res.render('general/receive-money',{title:'Receive Money',user:req.session.userName,msg:null,alert:null});
});

router.post('/receive-money',(req,res)=>{
    reciveMoney(req,(error,result)=>{
        if(error){
            res.render('general/receive-money',{title:'Receive Money',user:req.session.userName,msg:error,alert:'danger'});
        }else{
            res.render('general/receive-money',{title:'Receive Money',user:req.session.userName,msg:result,alert:'success'});
        }
    });
});

router.get('/send-money',authenticationMiddleware(),(req,res)=>{
    res.render('general/send-money',{title:'Send Money',user:req.session.userName,msg:null,alert:null});
});

router.post('/send-money',authenticationMiddleware(),(req,res)=>{
    sendMoney(req,req.session.userId,(error,result)=>{
        if(error){
            res.render('general/send-money',{title:'Send Money',user:req.session.userName,msg:error,alert:'danger'});
        } else{
            res.render('general/send-money',{title:'Send Money',user:req.session.userName,msg:`Money Sent Successfully to ${result}`,alert:'success'});
        }
    });
});

router.get('/balance',authenticationMiddleware(),(req,res)=>{
    sqldb.all('select balance from users where id=?',[req.session.userId],(errors,output)=>{
        if(errors){
            console.log(errors);
        }else{
            res.render('general/balance',{title:'Balance',user:req.session.userName,balance:output[0].balance});
        }
    });
});

router.get('/delete',authenticationMiddleware(),(req,res)=>{
    sqldb.all('delete from transactions where id = ?',[req.session.userId],(error)=>{
        if(error){
            console.log("Eroor in Deletion "+error);
            res.render('general/send-money',{title:'Send Money',user:req.session.userName,msg:`not deleted`,alert:'danger'});
        }else{
            sqldb.all('update users set balance=0,t_tran=0 where id = ?',[req.session.userId],(error1)=> {
                if(error1){
                    console.log(error1);
                }else{
                    req.session.transaction = 0;
                    res.render('general/send-money',{title:'Send Money',user:req.session.userName,msg:`Cleared`,alert:'success'});
                }
            });
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        if(err) console.log(err);
        console.log('session destroied');
    });
    res.render('login',{title:'PayArk',msg:'Logged Out successfully'});
});

module.exports = router;

