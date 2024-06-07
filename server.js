const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/registrationDB', { useNewUrlParser: true, useUnifiedTopology: true });

// User schema with unique constraints
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', userSchema);

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle uniqueness check
app.post('/check-unique', async (req, res) => {
    const { username, email } = req.body;
    try {
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            if (user.username === username) {
                res.json({ isUnique: false, message: 'Username already taken' });
            } else if (user.email === email) {
                res.json({ isUnique: false, message: 'Email already registered' });
            }
        } else {
            res.json({ isUnique: true });
        }
    } catch (error) {
        res.status(500).json({ isUnique: false, message: 'Server error' });
    }
});

// Handle form submission
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });

    try {
        await newUser.save();
        res.send('User registered successfully!');
    } catch (error) {
        res.status(500).send('Error saving user.');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
