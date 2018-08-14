const express = require('express');
const router = express.Router();
const app = express();
const User = require('./../controllers/userController');
const validate = require('../validate');
const Joi = require('joi');
const validator = require('express-joi-validation')({});
const commonFunctions = require('../commonFunctions');

router.post('/add', [validator.body(validate.create), commonFunctions.verifyToken], (req, res)=> {
    User.addUser(req.body).then(function(data){
        res.status(200).send(data);
    }, function(error){
        res.status(400).send(error);
    }).catch(function(e){
        res.status(400).send(e);
    });
});

router.get('/',commonFunctions.verifyToken,(req, res) => {
    User.getAllUsers().then((data)=> {
        res.status(200).send(data);
    }, (error) => {
        res.status(400).send(error);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

router.get('/:id', commonFunctions.verifyToken,(req, res) => {
    User.getSingleUser(req.params.id).then((data) => {
        res.status(200).send(data);
    }, (err) => {
        res.status(400).send(err);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

router.get('/remove/:id', commonFunctions.verifyToken,(req, res) => {
    User.removeUser(req.params.id).then((data)=> {
        res.status(200).send(data);
    }, (err)=>{
        res.status(400).send(err);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

module.exports = router;