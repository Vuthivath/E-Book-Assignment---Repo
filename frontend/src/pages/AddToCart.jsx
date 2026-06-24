import {useEffect, useState, useCallback} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {FaShoppingCart, FaTrash} from 'react-icons/fa';
import {getCart, saveCart} from '../cartUtils';

function AddToCart() {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState(getCart);

    // Listen for cart updates from other components
    useEffect(() => {
        const sync = () => setCartItems(getCart());
        window.addEventListener('cartUpdated', sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener('cartUpdated', sync);
            window.removeEventListener('storage', sync);
        };
    }, []);

    // Persist via saveCart so other components also get notified
    const updateCart = useCallback((updater) => {
        setCartItems((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            saveCart(next);
            return next;
        });
    }, []);

    const getImage = (item) => {
        const image = item.book_image;
        if (!image) return 'https://via.placeholder.com/100x130?text=No+Image';
        if (String(image).startsWith('http')) return image;
        const apiBase = import.meta.env.VITE_API_URL || '';
        return `${apiBase}${image}`;
    };

    const handleRemove = (item) => {
        updateCart((prev) => {
            const next = prev.filter((c) => c.id !== item.id);
            return next;
        });
    };

    const handleClearCart = () => {
        if (!window.confirm('Clear all items from cart?')) return;
        updateCart([]);
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.book_price * item.quantity, 0);

    return (
        <div className="min-vh-100" style={{background: '#f0ebe3'}}>
            <div className="container py-5">
                <div className="row">
                    {/* CART ITEMS */}
                    <div className="col-lg-8">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0" style={{fontFamily: 'Lato, serif'}}>
                                Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                            </h5>
                            {cartItems.length > 0 && (
                                <button
                                style={{fontFamily:'Lato', fontWeight:700}}
                                    className="btn btn-sm btn-outline-danger rounded-pill"
                                    onClick={handleClearCart}>
                                    Clear All
                                </button>
                            )}
                        </div>
                        <hr />

                        {cartItems.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="fs-1">
                                    <FaShoppingCart />
                                </p>
                                <p className="text-muted">Your cart is empty.</p>
                                <Link
                                    to="/books"
                                    className="btn text-white px-4"
                                    style={{background: '#7B9EB9', borderRadius: '6px'}}>
                                    Browse Books
                                </Link>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className="card border-0 shadow-sm rounded-3 mb-3 p-3">
                                    <div className="d-flex gap-3 align-items-center">
                                        {/* Book Image */}
                                        <img
                                            src={getImage(item)}
                                            alt={item.book_title}
                                            className="rounded-2"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/100x130?text=No+Image';
                                            }}
                                            style={{width: '80px', height: '110px', objectFit: 'cover', flexShrink: 0}}
                                        />

                                        {/* Book Info */}
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1">{item.book_title}</h6>
                                            <p className="text-muted small mb-1">by {item.book_author}</p>
                                            {item.book_category && (
                                                <p className="text-muted small mb-2">{item.book_category}</p>
                                            )}
                                            <span className="fw-bold" style={{color: '#000000'}}>
                                                ${item.book_price}
                                            </span>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="d-flex flex-column align-items-center gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-danger rounded-pill"
                                                style={{fontSize: '11px', fontFamily:'Lato', fontWeight:700}}
                                                onClick={() => handleRemove(item)}>
                                                <FaTrash className="me-1" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* ORDER SUMMARY */}
                    {cartItems.length > 0 && (
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm rounded-3 p-4">
                                <h5 className="fw-bold mb-3" style={{fontFamily: 'Lato, serif'}}>
                                    Order Summary
                                </h5>
                                <hr />

                                {cartItems.map((item) => (
                                    <div key={item.id} className="d-flex justify-content-between mb-2 small">
                                        <span className="text-muted">
                                            {item.book_title} × {item.quantity}
                                        </span>
                                        <span>${(item.book_price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}

                                <hr />

                                <div className="d-flex justify-content-between fw-bold mb-4">
                                    <span>Total</span>
                                    <span style={{color: '#000000'}}>${totalPrice.toFixed(2)}</span>
                                </div>

                                <button
                                    className="btn w-100 text-white fw-bold"
                                    style={{background: '#7B9EB9', borderRadius: '6px'}}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#2E4A5A')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = '#7B9EB9')}
                                    onClick={() => navigate('/checkout', {state: {cartItems}})}
                                    disabled={cartItems.length === 0}>
                                    Proceed to Checkout
                                </button>

                                <Link
                                    to="/books"
                                    className="btn w-100 mt-2"
                                    style={{border: '1px solid #7B9EB9', color: '#7B9EB9', borderRadius: '6px', fontFamily:'Lato'}}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#7B9EB9';
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.fontWeight = 800;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#7B9EB9';
                                    }}>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddToCart;
