let sqldb = require('../db.js');module.exports = (userID,t_id,t_p,amount,beforeBalance,afterBalance,cb)=>{    console.log('transaction page => \n '+userID+"\n "+t_id+"\n "+t_p+"\n "+amount+"\n "+beforeBalance+"\n "+afterBalance);    sqldb.all('insert into transactions values(?,?,?,?,?,?,?)',[userID,t_id,global.date,t_p,amount,beforeBalance,afterBalance],(err)=>{        if(err){            console.log(err);            console.log('Error In Transaction Generation');        }else{            cb('OK')        }    });};