const express = require('express');
const router = express.Router();
const db = require('../db'); // Import ng iyong MySQL connection (assuming nasa db.js)

// Order confirmation route
router.post('/confirm-order', (req, res) => {
    const { userId, items, totalPrice, totalItems } = req.body;

    if (!userId || !items || items.length === 0) {
        return res.status(400).send('Invalid order data');
    }

    const insertOrderQuery = 'INSERT INTO orders (user_id, total_price, total_items) VALUES (?, ?, ?)';
    db.query(insertOrderQuery, [userId, totalPrice, totalItems], (err, result) => {
        if (err) {
            console.error('Error inserting order:', err);
            return res.status(500).send('Order failed');
        }

        const orderId = result.insertId;
        const orderItemsData = items.map(item => [orderId, item.cup.id, item.quantity, item.price]);

        const insertOrderItemQuery = 'INSERT INTO order_items (order_id, cup_id, quantity, price) VALUES ?';
        db.query(insertOrderItemQuery, [orderItemsData], (err, result) => {
            if (err) {
                console.error('Error inserting order items:', err);
                return res.status(500).send('Order items failed');
            }

            res.send('Order confirmed successfully');
        });
    });
});

module.exports = router;
