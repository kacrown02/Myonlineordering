const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',   // Ensure this matches your MySQL root password
    database: 'cupdb', // Ensure the 'cupdb' database exists in MySQL
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
    console.log('MySQL Connected...');
});

// Registration route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const checkQuery = 'SELECT * FROM users WHERE username = ?';
        db.query(checkQuery, [username], (err, result) => {
            if (err) {
                console.error('Error checking user existence:', err);
                return res.status(500).send('Server error');
            }

            if (result.length > 0) {
                return res.status(400).send('Username already exists');
            }

            const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.query(insertQuery, [username, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting user into the database:', err);
                    return res.status(500).send('User registration failed');
                }
                res.send('User registered successfully');
            });
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Server error');
    }
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('User not found');
        }

        const validPassword = await bcrypt.compare(password, results[0].password);
        if (!validPassword) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
        res.json({ token });
    });
});

// Profile Update Route
app.put('/api/profile/update', async (req, res) => {
    const { username, name, address } = req.body;

    if (!username || !name || !address) {
        return res.status(400).send('All fields are required');
    }

    const updateQuery = 'UPDATE users SET name = ?, address = ? WHERE username = ?';
    db.query(updateQuery, [name, address, username], (err, result) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).send('Error updating profile');
        }
        res.send('Profile updated successfully');
    });
});

// Express.js route for payment processing
app.post('/api/payment/process', async (req, res) => {
    const { name, address, items, totalPrice } = req.body;

    // Validate input data
    if (!name || !address || !items || !totalPrice) {
        return res.status(400).send('Name, address, items, and total price are required');
    }

    try {
        const insertOrderQuery = 'INSERT INTO orders (name, address, items, totalPrice) VALUES (?, ?, ?, ?)';
        db.query(insertOrderQuery, [name, address, JSON.stringify(items), totalPrice], (err, result) => {
            if (err) {
                console.error('Error saving order to database:', err);
                return res.status(500).json({ message: 'Payment processing failed' });
            }
            res.status(200).json({ message: 'Payment processed successfully', orderId: result.insertId });
        });
    } catch (error) {
        console.error('Payment processing error:', error);
        return res.status(500).json({ message: 'Payment processing failed' });
    }
});

// Use the orderRoutes (Make sure you have the orderRoutes defined)
const orderRoutes = require('./routes/orderRoutes'); // Make sure this is correct
app.use('/api/orders', orderRoutes);  // Use '/api/orders' for order routes

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
