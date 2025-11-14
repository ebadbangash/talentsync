const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-me';

if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET not configured. Using development fallback secret.');
}


const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });
};

// Register User
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, email, password });
        res.status(201).json({
            message: 'User registered successfully',
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('User registration failed:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Login attempt failed:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Protected Route
exports.protectedRoute = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
    const verified = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ message: 'Access granted', user: verified });
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
