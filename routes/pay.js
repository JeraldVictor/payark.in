var express = require('express');
var router = express.Router();


let authenticationMiddleware = require('./auth.js');
let metro = require('./models/metro.js');
let parking = require('./models/parking.js');

/* GET users listing. */
router.get('/', authenticationMiddleware(),(req, res) =>{
    res.render('pay/pay',{title:'All Pyments', user: req.session.userName});
});

router.get('/metro',authenticationMiddleware(),(req,res)=>{
    res.render('pay/metro',{title:'Metro',user: req.session.userName,msg:null,alert:null});
});

router.get('/metro/blr',(req,res)=>{
    res.render('pay/metro/bangloreMetro',{title:'Banglore Metro',user: req.session.userName,msg:null,alert:null});
});

router.post('/metro',(req,res)=>{
    metro(req,(error,result)=>{
        if(error){
            res.render('pay/metro/bangloreMetro',{title:'Metro',user: req.session.userName,msg:error,alert:'danger'})
        }else{
            res.render('pay/metro/bangloreMetro',{title:'Metro',user: req.session.userName,msg:result,alert:'success'});
        }
    })
});

router.get('/parking', (req, res) =>{
    res.render('pay/parking',{title:'Parking', user: req.session.userName,msg:null});
});

router.post('/parking', (req, res) =>{
    parking(req,(err,result)=>{
        if(err){
            res.render('pay/parking',{title:'Parking', user: req.session.userName,msg:err,alert:'danger'});
        }else{
            res.render('pay/parking',{title:'Parking', user: req.session.userName,msg:result,alert:'success'});
        }
    });
});

router.get('/:anything',authenticationMiddleware(), (req, res) =>{
    let anything = req.params.anything;
    res.render('pay/pay',{title:anything, user: req.session.userName});
});

module.exports = router;
