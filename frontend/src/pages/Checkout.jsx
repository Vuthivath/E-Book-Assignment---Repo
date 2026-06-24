import {useState, useRef, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {FaPrint, FaTimes} from 'react-icons/fa';
import Khqr from '../assets/KHQR.jpg';

const TAX_RATE = 0.234;

function generateOrderNumber() {
    return 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #F5F0E8; font-family: 'Inter', sans-serif; }

  .app {
    min-height: 100vh;
    background: #F5F0E8;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 32px 16px;
  }

  .layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
    width: 100%;
    max-width: 900px;
  }

  .card {
    background: #FFFDF8;
    border: 1px solid #E2D9C8;
    border-radius: 12px;
    padding: 28px;
  }

  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #1A1208;
    margin-bottom: 20px;
  }

  .tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }

  .tab {
    flex: 1;
    padding: 12px 8px;
    border: 1.5px solid #C9BFA8;
    border-radius: 8px;
    background: transparent;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #6B5F4A;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .tab:hover { border-color: #5B8FA8; color: #5B8FA8; }

  .tab.active {
    background: #5B8FA8;
    border-color: #2E4A5A;
    color: #F5F0E8;
  }

  .form-group { margin-bottom: 16px; }

  .form-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: #6B5F4A;
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  .form-input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #C9BFA8;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #1A1208;
    background: #FFFDF8;
    outline: none;
    transition: border-color 0.15s;
  }

  .form-input:focus { border-color: #5B8FA8; }
  .form-input::placeholder { color: #B0A490; }

  .form-row { display: flex; gap: 12px; }
  .form-row .form-group { flex: 1; }

  .bank-info {
    background: #F5F0E8;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 16px;
  }

  .bank-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #E2D9C8;
    font-size: 13px;
  }

  .bank-row:last-child { border-bottom: none; }
  .bank-label { color: #8B7D69; font-weight: 500; }
  .bank-value { color: #1A1208; font-weight: 600; }

  .copy-btn {
    background: #5B8FA8;;
    color: #F5F0E8;
    border: none;
    border-radius: 5px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.05em;
    margin-left: 8px;
  }
    .copy-btn:hover { background: #2E4A5A; }

  .qr-container { text-align: center; padding: 16px 0; }

  .qr-placeholder {
    width: 180px;
    height: 180px;
    background: #E2D9C8;
    border-radius: 10px;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #8B7D69;
  }

  .qr-note {
    font-size: 12px;
    color: #8B7D69;
    text-align: center;
    line-height: 1.5;
    margin-top: 12px;
  }

  .book-row {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #E2D9C8;
  }

  .book-cover-img {
    width: 60px;
    height: 100px;
    border-radius: 5px;
    object-fit: cover;
    object-position: center;
    flex-shrink: 0;
  }

  .book-cover-fallback {
    width: 60px;
    height: 80px;
    border-radius: 5px;
    background: linear-gradient(135deg, #8B1A1A 0%, #C0392B 50%, #6B1010 100%);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: 700;
    color: #FFD700;
    text-align: center;
    padding: 4px;
    line-height: 1.3;
  }

  .book-info { flex: 1; }
  .book-title { font-size: 13px; font-weight: 600; color: #1A1208; line-height: 1.4; }
  .book-author { font-size: 12px; color: #8B7D69; margin-top: 3px; }

  .book-badge {
    display: inline-block;
    margin-top: 6px;
    padding: 2px 8px;
    background: #E2D9C8;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: #6B5F4A;
  }

  .book-price { font-size: 15px; font-weight: 700; color: #1A1208; }

  .price-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #6B5F4A;
    padding: 5px 0;
  }

  .price-row.total {
    font-size: 16px;
    font-weight: 700;
    color: #1A1208;
    padding-top: 12px;
    margin-top: 6px;
    border-top: 1.5px solid #1A1208;
  }

  .confirm-btn {
    width: 100%;
    margin-top: 20px;
    padding: 14px;
    background: #5B8FA8;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    cursor: pointer;
    transition: background 0.18s;
    text-transform: uppercase;
  }

  .confirm-btn:hover:not(:disabled) { background: #4A7A92; }
  .confirm-btn:disabled { background: #B0A490; cursor: not-allowed; }

  .overlay {
    position: fixed; inset: 0;
    background: rgba(20, 14, 6, 0.55);
    display: flex; align-items: center; justify-content: center;
    z-index: 100;
    padding: 24px;
  }

  .receipt-card {
    background: #FFFDF8;
    border: 1px solid #E2D9C8;
    border-radius: 14px;
    padding: 32px 36px;
    width: 100%;
    max-width: 420px;
    position: relative;
  }

  .receipt-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    color: #1A1208;
    text-align: center;
    margin-bottom: 20px;
  }

  .receipt-divider {
    height: 1px;
    background: #E2D9C8;
    margin: 14px 0;
  }

  .receipt-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    padding: 5px 0;
  }

  .receipt-row .r-label { color: #6B5F4A; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.07em; }
  .receipt-row .r-value { color: #1A1208; font-weight: 500; }
  .receipt-row.r-total .r-label,
  .receipt-row.r-total .r-value { font-size: 15px; font-weight: 700; color: #1A1208; }

  .receipt-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }

  .btn-print {
    flex: 1;
    padding: 12px;
    background: #5B8FA8;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: background 0.18s;
    text-transform: uppercase;
  }

  .btn-print:hover { background: #4A7A92; }

  .btn-close {
    padding: 12px 18px;
    background: transparent;
    color: #6B5F4A;
    border: 1.5px solid #C9BFA8;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-close:hover { border-color: #7B6E5A; }

  @media print {
    .overlay { position: static; background: none; padding: 0; }
    .app, .layout { display: none; }
    .receipt-card { border: none; padding: 0; max-width: none; }
    .btn-print, .btn-close { display: none; }
  }
`;

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const receiptRef = useRef(null);

    // Read cart items from location state (passed via navigate) or from localStorage
    const [cartItems] = useState(() => {
        if (location.state?.cartItems && location.state?.cartItems.length > 0) {
            return location.state.cartItems;
        }
        try {
            const saved = JSON.parse(localStorage.getItem('localCart') || '[]');
            return saved;
        } catch {
            return [];
        }
    });

    const [tab, setTab] = useState('credit');
    const [showReceipt, setShowReceipt] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    // Redirect back to cart if empty
    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.book_price) * item.quantity, 0);
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));
    const methodLabel = {credit: 'Credit Card', bank: 'Bank Transfer', khqr: 'KHQR'}[tab];

    const [orderNumber] = useState(generateOrderNumber);
    const orderDate = new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});

    async function handleConfirm() {
        setIsProcessing(true);
        setError('');

        const token = localStorage.getItem('access');
        if (!token) {
            navigate('/login');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        const apiBase = import.meta.env.VITE_API_URL || '';

        try {
            // Try checkout first — items might already be in the backend cart
            let res = await fetch(`${apiBase}/api/checkout/`, {
                method: 'POST',
                headers,
            });

            // If backend says cart is empty, sync local items to backend cart
            if (res.status === 400) {
                // Fetch all books from API so we can match localCart items by title
                let booksMap = {};
                try {
                    const booksRes = await fetch(`${apiBase}/api/books/`);
                    const booksData = await booksRes.json();
                    const books = Array.isArray(booksData) ? booksData : booksData.results || [];
                    for (const b of books) {
                        booksMap[b.title.toLowerCase()] = b.id;
                    }
                } catch {
                    throw new Error('Could not fetch book catalog. Try again.');
                }

                for (const item of cartItems) {
                    // Backend cart items have a "book" field (the DB ID)
                    let bookId = item.book;

                    // LocalCart items have book_title but no "book" ID — look it up
                    if (!bookId && item.book_title) {
                        bookId = booksMap[item.book_title.toLowerCase()];
                    }

                    if (!bookId) {
                        console.warn('Skipping item without book ID:', item.book_title);
                        continue;
                    }

                    const addRes = await fetch(`${apiBase}/api/cart/`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({
                            book: bookId,
                            quantity: item.quantity,
                        }),
                    });

                    if (!addRes.ok) {
                        const addData = await addRes.json();
                        throw new Error(addData.error || `Failed to add "${item.book_title}" to cart.`);
                    }
                }

                // Retry checkout after syncing
                res = await fetch(`${apiBase}/api/checkout/`, {
                    method: 'POST',
                    headers,
                });
            }

            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                    return;
                }
                const data = await res.json();
                throw new Error(data.error || 'Checkout failed. Please try again.');
            }

            // Success — clear local cart and show receipt
            localStorage.removeItem('localCart');
            setShowReceipt(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    }

    function handlePrint() {
        window.print();
    }

    const getImage = (item) => {
        const image = item.book_image;
        if (!image) return null;
        if (String(image).startsWith('http')) return image;
        const apiBase = import.meta.env.VITE_API_URL || '';
        return `${apiBase}${image}`;
    };

    if (!cartItems || cartItems.length === 0) return null;

    return (
        <>
            <style>{styles}</style>
            <div className="app">
                <div className="layout">
                    {/* ── Left: Payment method ── */}
                    <div className="card">
                        <h2 className="card-title">Payment method</h2>

                        <div className="tabs">
                            {[
                                ['credit', 'CREDIT'],
                                ['bank', 'BANK TRANSFER'],
                                ['khqr', 'KHQR'],
                            ].map(([key, label]) => (
                                <button
                                    key={key}
                                    className={`tab ${tab === key ? 'active' : ''}`}
                                    onClick={() => setTab(key)}>
                                    {label}
                                </button>
                            ))}
                        </div>

                        {tab === 'credit' && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Cardholder name</label>
                                    <input className="form-input" placeholder="e.g. Jane Doe" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Card number</label>
                                    <input className="form-input" placeholder="1234 1234 1234 1234" maxLength={19} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Expiry date</label>
                                        <input className="form-input" placeholder="MM / YY" maxLength={7} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">CVV</label>
                                        <input className="form-input" placeholder="123" maxLength={4} />
                                    </div>
                                </div>
                            </>
                        )}

                        {tab === 'bank' && (
                            <>
                                <p style={{fontSize: 15, fontWeight: 600, color: '#1A1208', marginBottom: 14}}>
                                    Transfer to this account
                                </p>
                                <div className="bank-info">
                                    <div className="bank-row">
                                        <span className="bank-label">BANK</span>
                                        <span className="bank-value">ABA BANK</span>
                                    </div>
                                    <div className="bank-row">
                                        <span className="bank-label">ACCOUNT NAME</span>
                                        <span className="bank-value">Booklet</span>
                                    </div>
                                    <div className="bank-row">
                                        <span className="bank-label">ACCOUNT NUMBER</span>
                                        <span className="bank-value">
                                            000 123 123
                                            <button
                                                className="copy-btn"
                                                onClick={() => navigator.clipboard?.writeText('000123123')}>
                                                COPY
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}

                        {tab === 'khqr' && (
                            <div className="qr-container">
                                <div>
                                    <img src={Khqr} style={{width: 180, height: 180, borderRadius: 10}} />
                                </div>
                                <p className="qr-note">Scan the QR code above to pay.</p>
                            </div>
                        )}
                    </div>

                    {/* ── Right: Order summary ── */}
                    <div className="card">
                        <h2 className="card-title">Order Summary</h2>

                        {cartItems.map((item) => (
                            <div className="book-row" key={item.id}>
                                {getImage(item) ? (
                                    <img
                                        src={getImage(item)}
                                        alt={item.book_title}
                                        className="book-cover-img"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className="book-cover-fallback" style={getImage(item) ? {display: 'none'} : {}}>
                                    {item.book_title?.substring(0, 8) || 'BOOK'}
                                </div>
                                <div className="book-info">
                                    <div className="book-title">{item.book_title}</div>
                                    {item.book_author && <div className="book-author">By {item.book_author}</div>}
                                    <span className="book-badge">DIGITAL</span>
                                </div>
                                <div className="book-price">
                                    ${(parseFloat(item.book_price) * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}

                        <div className="price-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="price-row">
                            <span>Tax</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="price-row total">
                            <span>TOTAL</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        {error && (
                            <div style={{color: '#C0392B', fontSize: 13, textAlign: 'center', marginTop: 12}}>
                                {error}
                            </div>
                        )}

                        <button className="confirm-btn" onClick={handleConfirm} disabled={isProcessing}>
                            {isProcessing ? 'PROCESSING...' : 'CONFIRM PAYMENT'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Receipt modal ── */}
            {showReceipt && (
                <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowReceipt(false)}>
                    <div className="receipt-card" ref={receiptRef}>
                        <h2 className="receipt-title">Receipt</h2>
                        <div className="receipt-divider" />

                        {cartItems.map((item) => (
                            <div className="receipt-row" key={item.id}>
                                <span className="r-label">BOOK</span>
                                <span className="r-value">
                                    {item.book_title} × {item.quantity}
                                </span>
                            </div>
                        ))}

                        <div className="receipt-divider" />

                        {[
                            ['ORDER NUMBER', orderNumber],
                            ['ORDER DATE', orderDate],
                            ['PAYMENT METHOD', methodLabel],
                        ].map(([label, value]) => (
                            <div className="receipt-row" key={label}>
                                <span className="r-label">{label}</span>
                                <span className="r-value">{value}</span>
                            </div>
                        ))}

                        <div className="receipt-divider" />

                        <div className="receipt-row">
                            <span className="r-label">SUB TOTAL</span>
                            <span className="r-value">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="receipt-row">
                            <span className="r-label">TAX</span>
                            <span className="r-value">${tax.toFixed(2)}</span>
                        </div>
                        <div className="receipt-row r-total">
                            <span className="r-label">TOTAL</span>
                            <span className="r-value">${total.toFixed(2)}</span>
                        </div>

                        <div className="receipt-actions">
                            <button className="btn-print" onClick={handlePrint}>
                                <FaPrint className="me-2" /> Print Receipt
                            </button>
                            <button className="btn-close" onClick={() => setShowReceipt(false)}>
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
