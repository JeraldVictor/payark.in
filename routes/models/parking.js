let balance = require('../functional/balance.js');let find = require('../functional/findUser.js');module.exports = (req,cb) =>{    console.log(global.date);    let total = req.body.total;    console.log(total);    console.log("connected");    balance.check(req.session.userId,total,(checkBal)=>{        if(checkBal === null){            cb('Transaction Failed Insufficient Balance');        }else{            find.findById(req.session.userId,(sender)=>{                if(sender===null){                    cb('error in fetching Current user');                }else{                        let t_p=`Parking Charge Detected`;                    console.log("no of transaction sender "+sender.t_tran);                    //balance Detection                    balance.reduceBal(sender.id,sender.balance,total,t_p,sender.t_tran,(reduction)=>{                        if(reduction === null){                            cb('Error occurred In Deducting Amount')                        }else{                            cb(undefined,'Transaction Succesfull');                        }                    });                }            })        }    });};