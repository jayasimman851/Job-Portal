const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session'); // Add session management

// Import routes
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use session middleware
app.use(session({
    secret: 'yourSecretKey', // Change this to a strong secret key
    resave: false,
    saveUninitialized: true,
}));

// MongoDB Connection
mongoose.connect('mongodb+srv://jayasimman851:user123@cluster0.4f2gn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Middleware to validate ObjectId format
const { Types: { ObjectId } } = mongoose;

const validateObjectId = (req, res, next) => {
    const userId = req.body.userId;
    if (userId && !ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }
    next();
};

// Routes
app.use('/jobs', jobRoutes);
app.use('/users', userRoutes);

// Use the validateObjectId middleware for apply job route
app.post('/jobs/apply/:jobId', validateObjectId, (req, res, next) => {
    // This will allow the request to continue to the jobRoutes for further processing
    next();
});

// Route for user signup
app.get('/users/signup', (req, res) => {
    res.render('signup');
});

// Route for handling signup form submission
app.post('/users/signup', async (req, res) => {
    const { name, email, password } = req.body;
    
    // Create a new user
    const User = require('./models/userModel'); // Import the User model here
    const newUser = new User({ name, email, password }); // Hash the password in a real app

    try {
        await newUser.save();
        req.session.userId = newUser._id; // Set user ID in session
        res.redirect('/'); // Redirect to home after successful signup
    } catch (error) {
        console.error(error);
        res.status(500).send('Error signing up user.');
    }
});

// Route for user login
app.get('/users/login', (req, res) => {
    res.render('login');
});

// Route for handling login form submission
app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    const User = require('./models/userModel'); // Import the User model here

    try {
        const user = await User.findOne({ email, password }); // Check user credentials (hash the password in a real app)
        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        req.session.userId = user._id; // Set user ID in session
        res.redirect('/'); // Redirect to home after successful login
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in user.');
    }
});

// Route for logging out
app.get('/users/logout', (req, res) => {
    req.session.destroy(); // Destroy session
    res.redirect('/'); // Redirect to home after logout
});

app.get('/', (req, res) => {
    res.render('index');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
