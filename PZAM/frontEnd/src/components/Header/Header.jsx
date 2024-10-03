import React from 'react';
import { Link } from 'react-router-dom';
import classes from './header.module.css';
import { useCart } from '../../hooks/useCart';

export default function Header() {
  const user = localStorage.getItem('user'); // Retrieve username from localStorage
  const { cart } = useCart();

  const logout = () => {
    localStorage.removeItem('token'); // Clear token
    localStorage.removeItem('user');  // Clear username
    window.location.reload(); // Reload the page to reflect logout
  };

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <Link to="/" className={classes.logo}>PZAM Cups Printing Davao!</Link>
        <nav>
          <ul>
            {user ? (
              <li className={classes.menu_container}>
                <span>{user}</span> {/* Show logged-in username */}
                <div className={classes.menu}>
                  <Link to="/profile">Profile</Link>
                  <Link to="/order">Orders</Link>
                  <a onClick={logout}>Logout</a>
                </div>
              </li>
            ) : (
              <Link to="/login">Login</Link>
            )}
            <li>
              <Link to="/cart">
                Cart
                {cart.totalCount > 0 && <span>{cart.totalCount}</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
