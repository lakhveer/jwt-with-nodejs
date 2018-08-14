const User = require('../modals/user');
const commonFunctions = require('../commonFunctions');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const jwt = require('jsonwebtoken');

module.exports = {
    login : function(body){
        return new Promise((resolve, reject)=>{
            User.findOne({email: body.email}, (err, res)=>{
                if(err){
                    return reject(commonFunctions.error(err));
                }else{
                    if(res == null){
                        return reject(commonFunctions.error('email doesn\'t exist'));
                    }else {
                        bcrypt.compare(body.password, res.password, function(err, resposne){
                            if(err){
                                return reject(commonFunctions.error(err));
                            }else{
                                if(resposne === false){
                                    return reject(commonFunctions.error('invalid email or password'));
                                }else{
                                    const token = commonFunctions.createToken(res);
                                    return resolve(commonFunctions.success({'token':token}));
                                }
                            }
                        });
                    }
                }
            });
        });
    },
    createResetPasswordToken: function(body){
        return new Promise((resolve, reject) => {
            User.findOne({email:body.email}, (err, res) => {
                if(err){
                    return reject(commonFunctions.error(err));
                }else{
                    if(res == null){
                        return reject(commonFunctions.error('email does\'t exist'));
                    }else{
                        const resetToken = commonFunctions.resetPasswordToken(res.email);
                        User.findByIdAndUpdate(res._id, {password_token: resetToken}, (err, success)=>{
                            if(err){
                                return reject(commonFunctions.error(err));
                            }else{
                                const msg = {
                                    to: body.email,
                                    from: process.env.SENDGRID_USER,
                                    subject: 'Reset Password',
                                    html: '<a href="http://localhost:3000/'+resetToken+'">Click hear</a> to reset your password',
                                  };
                                commonFunctions.sendMail(msg);
                                return resolve(commonFunctions.success('reset password link send your email ' + res.email));
                            }
                        });
                    }
                }
            });
        });
    },
    createPassword: function(body){
        return new Promise((resolve,reject) => {
            User.findOne({password_token: body.token}, (err, resp) => {
                if(err){
                    return reject(commonFunctions.error(err));
                }else{
                    if(resp == null){
                        return reject(commonFunctions.error('invalid token'));
                    }else{
                        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
                            console.log(salt);
                            if(err){
                                return reject(commonFunctions.error(err));
                            }else{
                                const decode = jwt.decode(body.token);
                                const query = {email: decode.email, password_token: body.token};
                                bcrypt.hash(body.password, salt, (err, hash) => {
                                    if(err){
                                        return reject(commonFunctions.error(err));
                                    }else{
                                         User.findOneAndUpdate(query,{$set:{ 'password': hash, 'password_token': '', origanal_password: body.password }},{new:true}, (err, res) => {
                                            if(err){
                                                console.log('err',err);
                                                return reject(commonFunctions.error(err));
                                            }else{
                                                console.log('res',res);
                                                return resolve(commonFunctions.success('password successfully reset'));
                                            }
                                        });
                                    }
                                });
                            }
                        });                        
                    }
                }
            });            
        }); 
    },
    addUser: function(body){
        return new Promise((resolve, reject) => {
            User.findOne({email: body.email},(err, res)=>{
                if(err){                
                    return reject(commonFunctions.error(err));
                }else {
                    if(res==null){
                        return resolve(commonFunctions.error('test aa....'));
                       /* body.origanal_password = body.password;
                        const user = new User(body);
                        user.save((error, success)=>{
                            if(err){
                                return reject(commonFunctions.error(err));
                            }else{
                                return resolve(commonFunctions.success('User Inserted'));
                            }
                        }); */
                    }else{
                        return resolve(commonFunctions.error('Email '+ body.email+ ' already exist!'));
                    }
                }
            });
        });
    },
    getAllUsers: function(){
        return new Promise((resolve, reject)=> {
            User.find({}, {password:0,origanal_password:0},(err, res) => {
                if(err){
                    return reject(commonFunctions.error(err));
                }else{
                    if(res.length <= 0){
                        return resolve(commonFunctions.success('data not found'));
                    }else{
                        return resolve(commonFunctions.success(res));
                    }
                }
            });
        });
    },
    getSingleUser: function(id){
        return new Promise((resolve, reject) => {
            User.findById(id, {password:0,origanal_password:0}, (err, res)=> {
                if(err){
                    return reject(commonFunctions.error(err));
                }else {
                    return resolve(commonFunctions.success(res));
                }
            });
        });
    },
    removeUser: function(id){
        return new Promise((resolve, reject) => {
            User.findByIdAndRemove(id,(err, res) => {
                if(err){
                    return reject(commonFunctions.error(err));
                }else{
                    if(res == null){
                        return resolve(commonFunctions.error('User not exist'));
                    }else{
                        return resolve(commonFunctions.success('User deleted'));
                    }                    
                }
            });
        });
    }
};
