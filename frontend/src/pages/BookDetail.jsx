import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {FaShoppingCart, FaHeart} from 'react-icons/fa';
import {addToCart, useCart} from '../cartUtils';

function BookDetail() {
    const {state} = useLocation();
    const navigate = useNavigate();
    const [added, setAdded] = useState(false);
    const [showCartPopup, setShowCartPopup] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [bookmarkMsg, setBookmarkMsg] = useState('');
    const [purchased, setPurchased] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('access');
    const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

    const cartItems = useCart();

    // Check if this book is already bookmarked (only for real DB ids)
    useEffect(() => {
        if (!state || !token || !user || !state.id) return;
        fetch(`${API_BASE}/bookmarks/`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((res) => {
                if (!res.ok) throw new Error('Auth failed');
                return res.json();
            })
            .then((data) => {
                const isBookmarked = data.some((b) => b.book === state.id);
                setBookmarked(isBookmarked);
            })
            .catch(() => {});
    }, [state, token, user]);

    // Check if user has purchased this book
    useEffect(() => {
        if (!state?.id || !token || !user) return;
        fetch(`${API_BASE}/books/${state.id}/purchased/`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                if (data) setPurchased(data.purchased);
            })
            .catch(() => {});
    }, [state, token, user]);

    if (!state) return <p className="text-center mt-5">No book selected.</p>;
    const {id, img, title, author, price, description, published, publisher, language, pages, genre, isbn} = state;

    // Always show Book details section for consistent layout
    // Use "—" placeholder for empty fields so the structure is uniform
    const fmt = (v) => (v && String(v).trim() ? v : '—');
    const handleAddToCart = () => {
        addToCart({
            book_title: title,
            book_author: author,
            book_price: price,
            book_image: img,
            book_category: '',
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const toggleBookmark = () => {
        if (!user || !token) {
            setBookmarkMsg('Log in to Wishlist');
            setTimeout(() => setBookmarkMsg(''), 2000);
            return;
        }

        if (!id) {
            setBookmarkMsg('Cannot Wishlist this item');
            setTimeout(() => setBookmarkMsg(''), 2000);
            return;
        }

        if (bookmarked) {
            fetch(`${API_BASE}/bookmarks/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({book: id}),
            })
                .then((res) => {
                    if (res.ok) {
                        setBookmarked(false);
                        setBookmarkMsg('Wishlist removed');
                        setTimeout(() => setBookmarkMsg(''), 1500);
                    }
                })
                .catch(() => {});
        } else {
            fetch(`${API_BASE}/bookmarks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({book: id}),
            })
                .then((res) => {
                    if (res.ok) {
                        setBookmarked(true);
                        setBookmarkMsg('Wishlist!');
                        setTimeout(() => setBookmarkMsg(''), 1500);
                    }
                })
                .catch(() => {});
        }
    };

    const btnHover = {
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        cursor: 'pointer',
    };

    const handleBtnEnter = (e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.opacity = '0.85';
    };

    const handleBtnLeave = (e) => {
        e.currentTarget.style.transform = 'scale(1.0)';
        e.currentTarget.style.opacity = '1';
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.book_price) * item.quantity, 0);

    return (
        <div className="container py-5" style={{maxWidth: '900px'}}>
            {/* FLOATING CART ICON */}
            <div style={{position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999}}>
                {/* Cart Button */}
                <button
                    onClick={() => setShowCartPopup(!showCartPopup)}
                    style={{
                        ...btnHover,
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: '#7B9EB9',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        position: 'relative',
                    }}
                    onMouseEnter={handleBtnEnter}
                    onMouseLeave={handleBtnLeave}>
                    <FaShoppingCart size={24} />
                    {totalItems > 0 && (
                        <span
                            style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                backgroundColor: '#2E4A5A',
                                color: 'white',
                                borderRadius: '50%',
                                width: '22px',
                                height: '22px',
                                fontSize: '0.7rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                            }}>
                            {totalItems}
                        </span>
                    )}
                </button>

                {/* Cart Popup */}
                {showCartPopup && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '70px',
                            right: '0',
                            width: '320px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                            padding: '16px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                        }}>
                        <h6 className="fw-bold mb-3" style={{color: '#2c1e12', fontFamily: 'Lato'}}>
                            Your Cart ({totalItems} items)
                        </h6>

                        {cartItems.length === 0 ? (
                            <p className="text-muted small text-center py-3">Your cart is empty.</p>
                        ) : (
                            <>
                                {cartItems.map((item, i) => (
                                    <div
                                        key={i}
                                        className="d-flex align-items-center gap-2 mb-2 pb-2"
                                        style={{borderBottom: '1px solid #f0ebe3'}}>
                                        <img
                                            src={item.book_image}
                                            alt={item.book_title}
                                            style={{
                                                width: '40px',
                                                height: '55px',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <div className="flex-grow-1">
                                            <p className="fw-bold mb-0" style={{fontSize: '0.8rem', color: '#2c1e12'}}>
                                                {item.book_title}
                                            </p>
                                            <p className="text-muted mb-0" style={{fontSize: '0.75rem'}}>
                                                x{item.quantity}
                                            </p>
                                        </div>
                                        <span
                                            className="fw-bold"
                                            style={{fontSize: '0.85rem', color: '#000000', flexShrink: 0}}>
                                            ${(parseFloat(item.book_price) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}

                                <div
                                    className="d-flex justify-content-between fw-bold mt-2 mb-3"
                                    style={{color: '#2c1e12'}}>
                                    <span>Total</span>
                                    <span style={{color: '#000000'}}>${totalPrice.toFixed(2)}</span>
                                </div>
                            </>
                        )}

                        <button
                            className="btn w-100 text-white fw-bold"
                            style={{
                                fontFamily: 'Lato',
                                fontWeight: 800,
                                backgroundColor: '#7B9EB9',
                                borderRadius: '8px',
                                ...btnHover,
                            }}
                            onMouseEnter={handleBtnEnter}
                            onMouseLeave={handleBtnLeave}
                            onClick={() => {
                                setShowCartPopup(false);
                                navigate('/cart');
                            }}>
                            Go to Cart
                        </button>
                    </div>
                )}
            </div>
            {/* Back Button */}
            <button
                className="btn btn-sm mb-4"
                style={{background: '#7B9EB9', color: 'white', ...btnHover}}
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
                onClick={() => navigate(-1)}>
                Back
            </button>
            <div className="d-flex gap-5">
                {/* Left: Book Image + Add to Cart */}
                <div style={{flexShrink: 0}}>
                    <img
                        src={img}
                        alt={title}
                        style={{width: '240px', height: '375px', objectFit: 'cover', borderRadius: '8px'}}
                    />
                    <div className="p-3 border rounded-3 mt-3" style={{maxWidth: '250px'}}>
                        <h4 className="fw-bold mb-1">${price}</h4>
                        <button
                            className="btn w-100 text-white mt-2"
                            style={{background: '#7B9EB9', ...btnHover}}
                            onMouseEnter={handleBtnEnter}
                            onMouseLeave={handleBtnLeave}
                            onClick={handleAddToCart}>
                            {added ? 'Added!' : 'Add to Cart'}
                        </button>
                        {purchased && (
                            <button
                                className="btn w-100 text-white mt-2"
                                style={{background: '#7B9EB9', ...btnHover}}
                                onMouseEnter={handleBtnEnter}
                                onMouseLeave={handleBtnLeave}
                                onClick={() => navigate('/reading', {state})}>
                                Read Book
                            </button>
                        )}
                        {/* Bookmark Button — only shown when logged in */}
                        {token && user && (
                            <div style={{position: 'relative'}}>
                                <button
                                    className="btn w-100 mt-2"
                                    style={{
                                        background: bookmarked ? '#2E4A5A' : 'transparent',
                                        color: bookmarked ? 'white' : '#2E4A5A',
                                        border: '2px solid #2E4A5A',
                                        fontWeight: 700,
                                        ...btnHover,
                                    }}
                                    onMouseEnter={handleBtnEnter}
                                    onMouseLeave={handleBtnLeave}
                                    onClick={toggleBookmark}>
                                    <FaHeart className="me-1" size={14} />
                                    {bookmarked ? 'Bookmarked' : 'Bookmark'}
                                </button>
                                {bookmarkMsg && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            bottom: '-24px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontSize: '0.75rem',
                                            color: '#2E4A5A',
                                            fontWeight: 600,
                                            whiteSpace: 'nowrap',
                                        }}>
                                        {bookmarkMsg}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Book Info */}
                <div className="flex-grow-1">
                    <h2 className="fw-bold mb-1">{title}</h2>
                    <p className="text-muted mb-3">By {author}</p>
                    <hr />

                    {/* About this book */}
                    <h5 className="fw-bold mb-2">About this book</h5>
                    <p style={{fontSize: '0.95rem', lineHeight: '1.7'}}>{description || 'No description available.'}</p>
                    <hr />

                    {/* Book details — always shown for consistent layout */}
                    <>
                        <h5 className="fw-bold mb-3">Book details</h5>
                        <div className="row g-3">
                            <div className="col-6">
                                <p className="text-muted small mb-0">PUBLISHED</p>
                                <p className="fw-bold mb-0">{fmt(published)}</p>
                            </div>
                            <div className="col-6">
                                <p className="text-muted small mb-0">PUBLISHER</p>
                                <p className="fw-bold mb-0">{fmt(publisher)}</p>
                            </div>
                            <div className="col-6">
                                <p className="text-muted small mb-0">LANGUAGE</p>
                                <p className="fw-bold mb-0">{fmt(language)}</p>
                            </div>
                            <div className="col-6">
                                <p className="text-muted small mb-0">PAGES</p>
                                <p className="fw-bold mb-0">{fmt(pages)}</p>
                            </div>
                            <div className="col-6">
                                <p className="text-muted small mb-0">GENRE</p>
                                <p className="fw-bold mb-0">{fmt(genre)}</p>
                            </div>
                            <div className="col-6">
                                <p className="text-muted small mb-0">ISBN</p>
                                <p className="fw-bold mb-0">{fmt(isbn)}</p>
                            </div>
                        </div>
                        <hr />
                    </>
                </div>
            </div>
        </div>
    );
}

export default BookDetail;
