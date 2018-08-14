const express = require('express');
const app= express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const Joi = require('joi');
const validator = require('express-joi-validation')({});

const valid = require('./validations/commonValidate');
const commonFunction = require('./commonFunctions');

// Routers
const userRoute = require('./routs/user');

const User = require('./controllers/userController');

module.exports = function(app){
    app.use(morgan(':status :method :url :response-time'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));  
    app.use(cors());	

    app.use((err, req, res, next) => {
        if (err.error.isJoi) {
            res.status(400).json({
            type: err.type, 
            message: err.error.toString()
          });
        } else {
          next(err);
        }
      });

    app.use('/user',userRoute);
    
    app.get('/', (req, res) => {
        res.send('App is running');
    });

    app.post('/login', validator.body(valid.login), function(req, res, next){
      User.login(req.body).then(function(data){
        res.status(200).send(data);
      },function(error){
        res.status(400).send(error);
      }).catch(function(e){
        res.status(400).send(e);
      });
    });

    app.get('/refreshToken',commonFunction.refreshToken, (req, res) => {
      res.status(200).json({success:true});
    });

   app.post('/resetPassword', [commonFunction.verifyToken,validator.body(valid.email)], (req, res) => {
    User.createResetPasswordToken(req.body).then((data) => {
      res.status(200).send(data);
    }, (err) => {
      res.status(400).send(err);
    }).catch((e) => {
      res.status(400).send(e);
    });
   });

   app.post('/createNewPassword', validator.body(valid.resetPasswordToken),(req, res) => {
    User.createPassword(req.body).then((data) => {
      res.status(200).send(data);
    }, (err) => {
      res.status(400).send(err)
    }).catch((e)=> {
      res.status(400).send(e);
    });
   });

};
