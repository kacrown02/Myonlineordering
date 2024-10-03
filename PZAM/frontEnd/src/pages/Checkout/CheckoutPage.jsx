import React from 'react';
import { useCart } from '../../hooks/useCart';
import OrderItemList from '../../components/OrderItemList/OrderItemList';
import Price from '../../components/Price/Price';
import classes from './checkoutPage.module.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function CheckoutPage() {
    const { cart } = useCart();
    const navigate = useNavigate(); // Initialize useNavigate

    // Example of getting the token, assuming it's stored in local storage or context
    const token = localStorage.getItem('token'); // Assuming token is saved in localStorage
    const currentUser = { id: 1 };  // Assuming this is fetched from your auth context or another source

    const handleConfirmOrder = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders/confirm-order', { // Updated URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Token-based authentication, if used
                },
                body: JSON.stringify({
                    userId: currentUser.id, // Assuming you have the current user information
                    items: cart.items,
                    totalPrice: cart.totalPrice,
                    totalItems: cart.totalCount
                })
            });

            if (response.ok) {
                // Navigate to payment page after successful order confirmation
                navigate('/payment');
            } else {
                console.error('Order confirmation failed');
            }
        } catch (error) {
            console.error('Error confirming order:', error);
        }
    };

    return (
        <div className={classes.container}>
            <h2>Checkout</h2>
            <OrderItemList items={cart.items} />
            <div className={classes.summary}>
                <h3>Order Summary</h3>
                <div>
                    <strong>Total Price:</strong> <Price price={cart.totalPrice} />
                </div>
                <div>
                    <strong>Total Items:</strong> {cart.totalCount}
                </div>
            </div>
            <button className={classes.confirmButton} onClick={handleConfirmOrder}>
                Confirm Order
            </button>
        </div>
    );
}
