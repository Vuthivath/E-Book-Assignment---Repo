import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaHeart, FaShoppingCart, FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import {addToCart, useCart} from '../cartUtils';
import {API_BASE_API, resolveImage} from '../config';

const ALL_GENRES = [
    // Fiction
    'Fiction',
    'Romance',
    'Fantasy',
    'Science Fiction',
    'Mystery',
    'Thriller/Suspense',
    'Horror',
    'Historical Fiction',
    'Young Adult',
    'Dystopian',
    'Contemporary',
    // Non-Fiction
    'Non-Fiction',
    'Biography',
    'Memoir',
    'Self-Help',
    'History',
    'True Crime',
    'Health & Fitness',
    'Cookbooks',
    'Travel',
    'Business & Careers',
    'Science & Nature',
];

const GENRE_COLORS = {
    Fiction: '#7F77DD',
    Romance: '#D4537E',
    Fantasy: '#7F77DD',
    'Science Fiction': '#378ADD',
    Mystery: '#888780',
    'Thriller/Suspense': '#D85A30',
    Horror: '#A32D2D',
    'Historical Fiction': '#639922',
    'Young Adult': '#D4537E',
    Dystopian: '#BA7517',
    Contemporary: '#378ADD',
    'Non-Fiction': '#888780',
    Biography: '#639922',
    Memoir: '#639922',
    'Self-Help': '#7F77DD',
    History: '#888780',
    'True Crime': '#A32D2D',
    'Health & Fitness': '#1D9E75',
    Cookbooks: '#1D9E75',
    Travel: '#378ADD',
    'Business & Careers': '#BA7517',
    'Science & Nature': '#1D9E75',
};

/* Booklet's navy accent pulled from the navbar */

const sidebarStyles = `
    .genre-sidebar {
        width: 210px;
        align-self: flex-start;
        flex-shrink: 0;
        background: #fff;
        border-right: 1px solid #e8e8e8;
        padding: 20px 12px;
        overflow-y: auto;
    }
    .genre-sidebar-title {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #aaa;
        padding: 0 6px;
        margin: 0 0 12px;
    }
    .genre-all-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 9px 12px;
        border-radius: 8px;
        border: none;
        background: transparent;
        font-size: 13.5px;
        font-weight: 600;
        color: #2d3f50;
        cursor: pointer;
        margin-bottom: 6px;
        transition: background 0.15s, color 0.15s;
        text-align: left;
    }
    .genre-all-btn:hover {
        background: #f0f3f6;
    }
    .genre-all-btn.active {
        background: #2d3f50;
        color: #fff;
        border-radius: 8px;
    }
    .genre-divider {
        border: none;
        border-top: 1px solid rgba(255,255,255,0.1);
        margin: 10px 0 4px;
    }
    .genre-section-label {
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 0.09em;
        text-transform: uppercase;
        color: #b0b8c1;
        padding: 0 6px;
        margin: 8px 0 4px;
    }
    .genre-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 7px 12px;
        border-radius: 7px;
        border: none;
        background: transparent;
        font-size: 13px;
        color: #4a5568;
        cursor: pointer;
        text-align: left;
        transition: background 0.15s, color 0.15s;
    }
    .genre-btn:hover {
        background: #f0f3f6;
        color: #2d3f50;
        font-weight: 700;
    }
    .genre-btn.active {
        background: #2d3f50;
        color: #fff;
        font-weight: 600;
    }
    .genre-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex-shrink: 0;
        opacity: 0.85;
    }
    .genre-btn.active .genre-dot {
        opacity: 1;
        box-shadow: 0 0 0 2px rgba(255,255,255,0.4);
    }
`;

const paginationStyles = `
    .pagination-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
        margin-top: 32px;
        padding: 16px 0;
    }
    .pagination-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 36px;
        height: 36px;
        padding: 0 10px;
        border: 2px solid #2d3f50;
        border-radius: 8px;
        background: transparent;
        color: #2d3f50;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s;
    }
    .pagination-btn:hover:not(:disabled) {
        background: #2d3f50;
        color: #fff;
    }
    .pagination-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }
    .pagination-btn.active {
        background: #2d3f50;
        color: #fff;
    }
    .pagination-info {
        font-size: 13px;
        color: #888;
        margin: 0 8px;
        white-space: nowrap;
    }
`;

function GenreSidebar({categories, selectedCategory, onSelect}) {
    const findCategory = (genreName) => categories.find((cat) => cat.name.toLowerCase() === genreName.toLowerCase());

    const fictionGenres = ALL_GENRES.slice(0, 11);
    const nonFictionGenres = ALL_GENRES.slice(11);

    const renderGenreBtn = (genre) => {
        const matched = findCategory(genre);
        const catId = matched ? String(matched.id) : '';
        const isActive = selectedCategory === catId && catId !== '';

        return (
            <button key={genre} className={`genre-btn${isActive ? ' active' : ''}`} onClick={() => onSelect(catId)}>
                <span className="genre-dot" style={{background: GENRE_COLORS[genre] || '#aaa'}} />
                {genre}
            </button>
        );
    };

    return (
        <>
            <style>{sidebarStyles}</style>
            <div className="genre-sidebar" style={{margin: '16px 0 16px 16px', borderRadius: '12px'}}>
                <p className="genre-sidebar-title">Genre</p>

                <button className={`genre-all-btn${!selectedCategory ? ' active' : ''}`} onClick={() => onSelect('')}>
                    All Categories
                </button>

                <hr className="genre-divider" />
                <p className="genre-section-label">Fiction</p>
                {fictionGenres.map(renderGenreBtn)}

                <hr className="genre-divider" />
                <p className="genre-section-label">Non-Fiction</p>
                {nonFictionGenres.map(renderGenreBtn)}
            </div>
        </>
    );
}

function FloatingCart() {
    const navigate = useNavigate();
    const cartItems = useCart();
    const [showCartPopup, setShowCartPopup] = useState(false);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.book_price) * item.quantity, 0);

    const handleBtnEnter = (e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.opacity = '0.85';
    };
    const handleBtnLeave = (e) => {
        e.currentTarget.style.transform = 'scale(1.0)';
        e.currentTarget.style.opacity = '1';
    };

    return (
        <div style={{position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999}}>
            <button
                onClick={() => setShowCartPopup(!showCartPopup)}
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#7B9EB9',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    position: 'relative',
                    cursor: 'pointer',
                }}>
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
                    <h6 className="fw-bold mb-3" style={{color: '#7B9EB9'}}>
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
                                        <p className="fw-bold mb-0" style={{fontSize: '0.8rem', color: '#7B9EB9'}}>
                                            {item.book_title}
                                        </p>
                                        <p className="text-muted mb-0" style={{fontSize: '0.75rem'}}>
                                            x{item.quantity}
                                        </p>
                                    </div>
                                    <span className="fw-bold" style={{fontSize: '0.85rem', flexShrink: 0}}>
                                        ${(parseFloat(item.book_price) * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                            <div
                                className="d-flex justify-content-between fw-bold mt-2 mb-3"
                                style={{color: '#7B9EB9'}}>
                                <span>Total</span>
                                <span style={{color: '#000'}}>${totalPrice.toFixed(2)}</span>
                            </div>
                        </>
                    )}
                    <button
                        className="btn w-100 text-white fw-bold"
                        style={{backgroundColor: '#7B9EB9', borderRadius: '8px'}}
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
    );
}

function Pagination({currentPage, totalPages, totalCount, onPageChange}) {
    if (totalPages <= 1) return null;

    // Build page number list (max 7 visible)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 7;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <>
            <style>{paginationStyles}</style>
            <div className="pagination-wrapper">
                <span className="pagination-info">
                    {totalCount} book{totalCount !== 1 ? 's' : ''}
                </span>

                <button
                    className="pagination-btn"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <FaChevronLeft size={12} />
                </button>

                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        className={`pagination-btn${page === currentPage ? ' active' : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className="pagination-btn"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <FaChevronRight size={12} />
                </button>
            </div>
        </>
    );
}

function Books() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [search, setSearch] = useState('');
    const [cartMessage, setCartMessage] = useState('');
    const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const handleCategoryChange = (catId) => {
        setSelectedCategory(catId);
        setCurrentPage(1);
    };

    const navigate = useNavigate();

    const token = localStorage.getItem('access');
    const user = JSON.parse(localStorage.getItem('user'));

    const extractPageData = (data) => {
        if (Array.isArray(data)) {
            // Non-paginated response fallback
            setTotalPages(1);
            setTotalCount(data.length);
            return data;
        }
        if (data?.results) {
            setTotalCount(data.count || 0);
            setTotalPages(Math.ceil((data.count || 0) / 12));
            return data.results;
        }
        setTotalPages(1);
        setTotalCount(0);
        return [];
    };

    useEffect(() => {
        fetch(`${API_BASE_API}/categories/`)
            .then((res) => res.json())
            .then((data) => {
                const arr = Array.isArray(data) ? data : data?.results || [];
                setCategories(arr);
            })
            .catch(() => console.log('Categories fetch failed'));
    }, []);

    useEffect(() => {
        let url = `${API_BASE_API}/books/?page=${currentPage}`;
        if (selectedCategory) url += `&category=${selectedCategory}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => setBooks(extractPageData(data)))
            .catch(() => {
                setBooks([]);
                console.log('Books fetch failed');
            });
    }, [selectedCategory, search, currentPage]);

    // Fetch bookmarked IDs
    useEffect(() => {
        if (!token || !user) return;
        fetch(`${API_BASE_API}/bookmarks/`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((res) => res.json())
            .then((data) => {
                setBookmarkedIds(new Set(data.map((b) => b.book)));
            })
            .catch(() => {});
    }, [token, user]);

    const getImage = (book) => resolveImage(book?.image);

    const showMessage = (msg) => {
        setCartMessage(msg);
        setTimeout(() => setCartMessage(''), 3000);
    };

    const handleBuyNow = (book) => {
        addToCart({
            book_title: book.title,
            book_author: book.author,
            book_price: book.price,
            book_image: getImage(book),
            book_category: book.category_name || '',
        });
        showMessage(`"${book.title}" Added to cart!`);
    };

    const handleBookmark = (bookId) => {
        if (!token || !user) {
            showMessage('Log in to bookmark');
            return;
        }

        const isBookmarked = bookmarkedIds.has(bookId);

        if (isBookmarked) {
            fetch(`${API_BASE_API}/bookmarks/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({book: bookId}),
            })
                .then((res) => {
                    if (res.ok) {
                        const next = new Set(bookmarkedIds);
                        next.delete(bookId);
                        setBookmarkedIds(next);
                        showMessage('Bookmark removed');
                    }
                })
                .catch(() => {});
        } else {
            fetch(`${API_BASE_API}/bookmarks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({book: bookId}),
            })
                .then((res) => {
                    if (res.ok) {
                        const next = new Set(bookmarkedIds);
                        next.add(bookId);
                        setBookmarkedIds(next);
                        showMessage('Bookmarked!');
                    }
                })
                .catch(() => {});
        }
    };

    return (
        <div className="min-vh-100" style={{background: '#f0ebe3'}}>
            <FloatingCart/>
            <nav className="navbar px-4 py-3">
                <input
                    style={{fontFamily: 'Lato'}}
                    type="text"
                    placeholder="Search books"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="form-control rounded-pill px-4 w-50 m-auto"
                />
            </nav>

            {cartMessage && (
                <div
                    style={{
                        position: 'fixed',
                        top: '70px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10000,
                        background: '#7B9EB9',
                        color: 'white',
                        padding: '10px 24px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '14px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    }}>
                    {cartMessage}
                </div>
            )}
            <h5 className="fw-bold mb-1 text-center" style={{fontFamily: 'Lato, serif', fontWeight: 'bolder'}}>
                ALL BOOKS
            </h5>
            <div className="d-flex">
                <GenreSidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={handleCategoryChange}
                />

                <div className="flex-grow-1 p-4">
                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                        {books.map((book) => {
                            const isBm = bookmarkedIds.has(book.id);
                            return (
                                <div key={book.id} className="col">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <img
                                            src={getImage(book)}
                                            alt={book.title}
                                            className="card-img-top"
                                            style={{height: '380px', objectFit: 'cover'}}
                                        />
                                        <div className="card-body d-flex flex-column p-3">
                                            <h6 className="fw-bold mb-1" style={{fontSize: '0.85rem'}}>
                                                {book.title}
                                            </h6>
                                            <p className="text-muted small mb-1" style={{fontSize: '0.78rem'}}>
                                                {book.author}
                                            </p>
                                            <p className="mb-2" style={{fontSize: '0.82rem'}}>
                                                <strong>Price: ${book.price}</strong>
                                            </p>
                                            <div className="mt-auto d-flex flex-column gap-1">
                                                <div className="d-flex gap-1" style={{fontFamily: 'Lato'}}>
                                                    <button
                                                        className="btn btn-sm flex-grow-1"
                                                        style={{
                                                            background: '#7B9EB9',
                                                            color: '#fff',
                                                            transition: 'background 0.2s',
                                                        }}
                                                        onMouseEnter={(e) =>
                                                            (e.currentTarget.style.background = '#2E4A5A')
                                                        }
                                                        onMouseLeave={(e) =>
                                                            (e.currentTarget.style.background = '#7B9EB9')
                                                        }
                                                        onClick={() => handleBuyNow(book)}>
                                                        Buy
                                                    </button>
                                                    {token && user && (
                                                        <button
                                                            className="btn btn-sm"
                                                            style={{
                                                                background: isBm ? '#2E4A5A' : 'transparent',
                                                                color: isBm ? 'white' : '#2E4A5A',
                                                                border: '2px solid #2E4A5A',
                                                                minWidth: '38px',
                                                                padding: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                            onClick={() => handleBookmark(book.id)}
                                                            title={isBm ? 'Remove bookmark' : 'Add bookmark'}>
                                                            <FaHeart size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                                <button
                                                    className="btn btn-sm w-100"
                                                    style={{
                                                        fontFamily: 'Lato',
                                                        background: 'transparent',
                                                        borderColor: '#2d3f50',
                                                        border: '1px solid #2d3f50',
                                                        color: '#2d3f50',
                                                        fontSize: '0.78rem',
                                                        transition: 'all 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#2d3f50';
                                                        e.currentTarget.style.color = '#fff';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'transparent';
                                                        e.currentTarget.style.color = '#2d3f50';
                                                    }}
                                                    onClick={() =>
                                                        navigate('/book-detail', {
                                                            state: {
                                                                id: book.id,
                                                                img: getImage(book),
                                                                title: book.title,
                                                                author: book.author,
                                                                price: book.price,
                                                                description: book.description || '',
                                                                genre: book.category_name || '',
                                                                published: book.published || '',
                                                                publisher: book.publisher || '',
                                                                language: book.language || '',
                                                                pages: book.pages || '',
                                                                isbn: book.isbn || '',
                                                            },
                                                        })
                                                    }>
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {books.length === 0 && <p className="text-muted mt-4">No books found.</p>}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}

export default Books;
