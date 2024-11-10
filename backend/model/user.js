const { Schema, model } = require('mongoose')
const express = require('express')
const { createHmac, randomBytes } = require("crypto");
const { createTokenforUser } = require('../services/auth');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    userForms: [{
        type: Schema.Types.ObjectId,
        ref: 'form',
    }],
},
    { timestamps: true }
);

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function(email,password) {
    const user = await this.findOne({email});
    if(!user) return 'User not found';
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac('sha256', salt)
    .update(password)
    .digest("hex");

    if(hashedPassword !== userProvidedHash) return 'Incorrect Password';

    const token = createTokenforUser(user);
    return {token};
});

const User = model('user', userSchema);

module.exports = User;