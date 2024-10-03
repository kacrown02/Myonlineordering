// src/pages/Payment/PaymentPage.jsx
import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import classes from './payment.module.css'; // Make sure to create this CSS file for styling
import Price from '../../components/Price/Price'; // Import Price component

const PaymentPage = () => {
    const { cart } = useCart(); // Get cart items from the cart context
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/payment/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    address,
                    items: cart.items, // Include items for the order
                    totalPrice: cart.totalPrice,
                }),
            });

            if (response.ok) {
                alert('Payment successful!');
                // Optionally redirect or reset the cart
            } else {
                throw new Error('Payment processing failed');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={classes.container}>
            <h2>Payment Page</h2>
            <form onSubmit={handlePaymentSubmit}>
                <div className={classes.formGroup}>
                    <label className={classes.label} htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className={classes.input}
                        value={name}
                        onChange={handleNameChange}
                        required
                    />
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.label} htmlFor="address">Shipping Address:</label>
                    <input
                        type="text"
                        id="address"
                        className={classes.input}
                        value={address}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                {error && <div className={classes.error}>{error}</div>}
                <button className={classes.button} type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Pay with GCash'}
                </button>
            </form>

            <div className={classes.orderList}>
                <h3>Your Order Items:</h3>
                {cart.items.length > 0 ? (
                    cart.items.map((item) => (
                        <div key={item.cup.id} className={classes.orderItem}>
                            <img src={`/cups/${item.cup.imageUrl}`} alt={item.cup.name} />
                            <div>
                                <strong>{item.cup.name}</strong> - {item.quantity} x <Price price={item.price} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No items in cart.</p>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;


