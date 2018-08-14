const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, index: { unique: true } },
    password: { type: String, require: true },
    origanal_password: { type: String },
    password_token: { type: String }
});

userSchema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(process.env.SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', userSchema);