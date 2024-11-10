const express = require("express")
const { Router } = require("express");
const mongoose = require("mongoose")
const User = require('../model/user');
const router = Router();


router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(userId, 'firstName lastName email gender userForms');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'firstName lastName email gender userForms');
        res.json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, gender, password } = req.body;
    try {

        await User.create({ firstName, lastName, email, gender, password });
        res.send("Signed-Up");
    } catch (error) {
        console.error('Error signing up:', error);
        if (error.code === 11000) {
            return res.status(400).send('Email already in use');
        }
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        const user = await User.findOne({ email });
        if (token === 'Incorrect Password' || token === 'User not found') {
            return res.status(400).send(token);
        }
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        }).json({
            token,
            userId: user._id,
        });
    } catch (error) {
        res.status(500).send("Error logging in");
    }
});

router.post('/logout', (req, res) => {
    res.send("Logged-Out");
});


router.put('/update/:userId', async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, email, gender } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const updateData = { firstName, lastName, email, gender };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.delete('/delete/:userId', async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;