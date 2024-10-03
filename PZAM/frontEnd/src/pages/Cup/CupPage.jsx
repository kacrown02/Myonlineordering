import React, { useEffect, useState } from 'react';
import classes from './cupPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getById } from '../../Services/cupServices';
import StarRating from '../../components/StarRating/StarRating';
import Tags from '../../components/Tags/Tags';
import Price from '../../components/Price/Price';
import { useCart } from '../../hooks/useCart';

export default function CupPage() {
    const [cup, setCup] = useState(null); // Initialize as null to handle loading state
    const { id } = useParams();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Handle adding item to cart and navigating to the cart page
    const handleAddToCart = () => {
        if (cup) { // Make sure cup is fully loaded before adding
            addToCart(cup); // Add cup to cart
            navigate('/cart'); // Navigate to cart page
        }
    };

    useEffect(() => {
        getById(id).then(setCup); // Fetch cup by ID from the service
    }, [id]);

    // If cup data is not yet available, show a loading message
    if (!cup) {
        return <div>Loading...</div>;
    }

    return (
        <div className={classes.container}>
            <img
                className={classes.image}
                src={`/cups/${cup.imageUrl}`} // Dynamic image path
                alt={cup.name}
            />
            <div className={classes.details}>
                <div className={classes.header}>
                    <span className={classes.name}>{cup.name}</span>
                    <span className={`${classes.favorite} ${cup.favorite ? '' : classes.not}`}>
                        ♥
                    </span>
                </div>
                <div className={classes.rating}>
                    <StarRating stars={cup.stars} size={25} />
                </div>

                <div className={classes.tags}>
                    {cup.tags && (
                        <Tags tags={cup.tags.map(tag => ({ name: tag }))} forCupPage={true} />
                    )}
                </div>
            </div>
            <div className={classes.price}>
                <Price price={cup.price} />
            </div>

            <button onClick={handleAddToCart}>Add To Cart</button>
        </div>
    );
}
