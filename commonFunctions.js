const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const commonFunctions = {};

commonFunctions.success = function(data){
    const msg = {
        success: true,
        data: data
    };
    return msg;
};

commonFunctions.error = function(data){
    const msg = {
        error: true,
        data: data
    };
    return msg;
};

commonFunctions.createToken = function(body){
    const payload = {id: body._id, email: body.email, name: body.name, password: body.password};
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn:  600 }); //10 min
    return token;
};

commonFunctions.verifyToken = function(req, res, next){
    const token = req.headers['auth_token'];
    if(token != undefined || token != null){
        jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
            if(err){
                res.status(400).json(commonFunctions.error(err));
            }else{
                next();
            }
        });
    }else {
        res.status(400).json(commonFunctions.error('No token provided'));
    }    
};

commonFunctions.refreshToken = function(req, res, next){
    const token = req.headers['auth_token'];
    if(token != undefined || token != null){
        jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
            if(err){
                var decoded = jwt.decode(token);
                const payload = {id: decoded.id, email: decoded.email, name: decoded.name, password: decoded.password};
                const refreshtoken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn:  600 });
                res.status(200).json(commonFunctions.success(refreshtoken));
            }else{
                next();
            }
        });
    }else {
        res.status(400).json(commonFunctions.error('No token provided'));
    }  
};

commonFunctions.resetPasswordToken = function(email){
    const resetToken = jwt.sign({email: email},process.env.JWT_SECRET,{expiresIn: 3600});
    return resetToken;
};

commonFunctions.sendMail = function(body) {
    sgMail.send(body);
    return;
};

module.exports = commonFunctions; 