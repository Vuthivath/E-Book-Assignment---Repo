import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaShoppingCart, FaBookmark} from 'react-icons/fa';
import {useCart} from '../cartUtils';
import {API_BASE_API, API_BASE} from '../config';

function Home() {
    const cartItems = useCart();
    const [showCartPopup, setShowCartPopup] = useState(false);
    const [hoveredMost, setHoveredMost] = useState(null);
    const [hoveredNew, setHoveredNew] = useState(null);
    const [mostReadBooks, setMostReadBooks] = useState([]);
    const [newReleaseBooks, setNewReleaseBooks] = useState([]);
    const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
    const [bookmarkMsg, setBookmarkMsg] = useState('');

    const navigate = useNavigate();
    const token = localStorage.getItem('access');
    const userObj = JSON.parse(localStorage.getItem('user'));

    const extractArray = (data) => (Array.isArray(data) ? data : data?.results || []);

    useEffect(() => {
        fetch(`${API_BASE_API}/books/?most_read=true`)
            .then((res) => res.json())
            .then((data) => setMostReadBooks(extractArray(data)))
            .catch(() => console.log('Failed to fetch most read books'));
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_API}/books/?new_release=true`)
            .then((res) => res.json())
            .then((data) => setNewReleaseBooks(extractArray(data)))
            .catch(() => console.log('Failed to fetch new release books'));
    }, []);

    // Fetch bookmarked IDs
    useEffect(() => {
        if (!token || !userObj) return;
        fetch(`${API_BASE_API}/bookmarks/`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((res) => res.json())
            .then((data) => {
                const arr = Array.isArray(data) ? data : data.results || [];
                setBookmarkedIds(new Set(arr.map((b) => b.book)));
            })
            .catch(() => {});
    }, []);

    const showBookmarkMsg = (msg) => {
        setBookmarkMsg(msg);
        setTimeout(() => setBookmarkMsg(''), 2000);
    };

    const goToDetail = (book) => {
        const detailState = {
            id: book.id || null,
            img: book.img || book.image || getImage(book),
            title: book.title,
            author: book.author,
            price: book.price,
            description: book.description || '',
            published: book.published || '',
            publisher: book.publisher || '',
            language: book.language || '',
            pages: book.pages || '',
            genre: book.genre || book.category_name || '',
            isbn: book.isbn || '',
        };
        navigate('/book-detail', {state: detailState});
    };

    const handleBookmark = (bookId) => {
        if (!token || !userObj) {
            showBookmarkMsg('Log in to bookmark');
            return;
        }

        if (!bookId) {
            showBookmarkMsg('Cannot bookmark this item');
            return;
        }

        const isBm = bookmarkedIds.has(bookId);

        if (isBm) {
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
                        showBookmarkMsg('Bookmark removed');
                    } else {
                        showBookmarkMsg('Failed to remove bookmark');
                    }
                })
                .catch(() => showBookmarkMsg('Connection error'));
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
                        showBookmarkMsg('Bookmarked!');
                    } else {
                        showBookmarkMsg('Failed to bookmark');
                    }
                })
                .catch(() => showBookmarkMsg('Connection error'));
        }
    };

    const btnHover = {
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        cursor: 'pointer',
    };

    const handleMouseEnter = (e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = 'scale(1.0)';
        e.currentTarget.style.boxShadow = 'none';
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

    const topBooks = [
        {
            img: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1750697361i/228022844.jpg',
            title: 'Audition For The Fox',
            author: 'Martin Cahill',
            price: '12.99',
            description:
                "Audition for the Fox is a fantasy novella about Nesi, a young woman who seeks the blessing of a god. After many failed attempts, the trickster god Fox sends her 300 years into the past. There, she must help a people fighting against an oppressive empire and prove herself worthy of the Fox's favor.",
            published: '2025',
            publisher: 'Tachyon Publications',
            language: 'English',
            pages: '192',
            genre: 'Psychological horror, Thriller, Literary fiction',
            isbn: '978-1616964443',
        },
        {
            img: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1569514209i/45047384.jpg',
            title: 'The House in the Cerulean Sea',
            author: 'T.J. Klune',
            price: '10.50',
            description:
                'The House in the Cerulean Sea is a fantasy novel about Linus Baker, a caseworker who inspects orphanages for magical children. He is sent to a remote island to evaluate an unusual orphanage run by Arthur Parnassus, where he meets six extraordinary children, including the Antichrist. As Linus gets to know the children and Arthur, he begins to question the rules he has always followed and learns the importance of acceptance, family, and being true to oneself.',
            published: '2020',
            publisher: 'Tor Books',
            language: 'English',
            pages: '396',
            genre: 'Fantasy, Magical Realism, LQTBQ+ fiction',
            isbn: '978-1250217288',
        },
        {
            img: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1590677390i/53568397.jpg',
            title: 'The Midnight Library',
            author: 'Matt Haig',
            price: '11.99',
            description:
                'The Midnight Library is a fantasy novel about Nora Seed, a woman who finds herself in a mysterious library between life and death. Each book in the library lets her experience a different version of her life based on choices she could have made. As Nora explores these alternate lives, she learns about regret, happiness, and what makes life worth living.',
            published: '2020',
            publisher: 'Canongate Books',
            language: 'English',
            pages: '304',
            genre: 'Contemporary fiction, Philosophical fiction',
            isbn: '978-1786892737',
        },
        {
            img: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1667414469i/61054804.jpg',
            title: 'The Cloister',
            author: 'Katy Hays',
            price: '12.99',
            description:
                'The Cloisters follows Ann Stilwell, a recent college graduate who takes a summer position at a gothic museum in New York called The Cloisters. As she joins a group of researchers studying divination, she discovers a mysterious 15th-century tarot deck that may be able to predict the future. Drawn into a world of ambition, obsession, secrets, and rivalry, Ann finds herself caught in a dangerous mystery where the line between fate and free will becomes increasingly blurred.',
            published: '2022',
            publisher: 'Atria Books',
            language: 'English',
            pages: '320',
            genre: 'Mystery, Thriller, Dark academia',
            isbn: '978-1668004401',
        },
    ];

    const featuredBooks = [
        {
            img: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1523547032i/12600138.jpg',
            title: 'Ready Player One',
            author: 'Earnest Cline',
            price: '9.99',
            description:
                'Ready Player One is a science-fiction novel set in a future where people escape their harsh reality by spending most of their time in a virtual reality world called the OASIS. When the creator of the OASIS dies, he leaves behind a hidden contest that promises his fortune and control of the virtual world to whoever can solve a series of puzzles. Teenager Wade Watts joins the hunt, facing rivals and a powerful corporation while uncovering clues based on pop culture from the 1980s.',
            published: '2011',
            publisher: 'Crown Publishing Group',
            language: 'English',
            pages: '384',
            genre: 'Science fiction, Dystopian, Adventure',
            isbn: '978-0307887443',
        },
        {
            img: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1700221964i/40275288.jpg',
            title: 'The Priority of Orange Tree',
            author: 'Samantha Shannon',
            price: '13.99',
            description:
                'The Priory of the Orange Tree is an epic fantasy novel set in a world divided by politics, religion, and the fear of an ancient dragon known as The Nameless One. The story follows several characters, including Queen Sabran Berethnet, dragon rider Tané, and mage Ead Duryan, as they confront political intrigue, forbidden magic, and a looming threat that could destroy their world. It is a story about power, faith, loyalty, and the fight to unite against a common enemy.',
            published: '2019',
            publisher: 'Bloomsbury Publishing',
            language: 'English',
            pages: '848',
            genre: 'Epic fantasy',
            isbn: '978-1635570298',
        },
        {
            img: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1763319839i/240019815.jpg',
            title: 'Seek Immediate Shelter',
            author: 'Vincent Yu',
            price: '18.99',
            description:
                'The book is a contemporary literary drama about what people reveal when they believe the world is about to end. After a mistaken missile alert throws a community into panic, the story follows several interconnected characters as they grapple with relationships, family expectations, hidden feelings, and the gap between who they are and who they want to be. Rather than focusing on action or disaster, the novel explores how a brief moment of crisis can expose personal truths and force people to reevaluate their lives, making it a character-driven story centered on human connections and emotional consequences.',
            published: '2026',
            publisher: 'Flatiron Books',
            language: 'English',
            pages: '364',
            genre: 'Literary fiction, Contennporary fiction, Community drama',
            isbn: '978-1250410139 (hardcover edition)',
        },
    ];

    const getImage = (book) => {
        if (!book?.image) return 'https://via.placeholder.com/400x320?text=No+Image';
        const image = String(book.image).trim();
        if (image.startsWith('http')) return image;
        if (image.startsWith('/')) return `${API_BASE}${image}`;
        return `${API_BASE}/${image}`;
    };

    const renderBookSection = (title, books, hovered, setHovered) => (
        <div className="mb-5">
            <h4 className="fw-bold mb-3" style={{fontSize: '1.75rem', fontFamily: 'Lato', fontWeight: '900'}}>
                {title}
            </h4>
            <div className="d-flex gap-4">
                {books.length > 0 ? (
                    books.map((book, i) => {
                        const isBm = bookmarkedIds.has(book.id);
                        return (
                            <div key={book.id} className="d-flex flex-column text-center" style={{width: '20%'}}>
                                <div
                                    style={{
                                        aspectRatio: '1.8/3',
                                        overflow: 'hidden',
                                        borderRadius: '8px',
                                        position: 'relative',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                    }}>
                                    <img
                                        alt={book.title}
                                        src={getImage(book)}
                                        onClick={() => goToDetail(book)}
                                        onMouseEnter={() => setHovered(i)}
                                        onMouseLeave={() => setHovered(null)}
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'cover',
                                            transform: hovered === i ? 'scale(1.02)' : 'scale(1)',
                                            transition: 'transform 0.3s ease',
                                            cursor: 'pointer',
                                        }}
                                    />
                                    {token && userObj && book.id && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBookmark(book.id);
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: isBm ? '#2E4A5A' : 'rgba(255,255,255,0.85)',
                                                color: isBm ? 'white' : '#2E4A5A',
                                                border: '2px solid #2E4A5A',
                                                borderRadius: '50%',
                                                width: '34px',
                                                height: '34px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                            }}
                                            title={isBm ? 'Remove bookmark' : 'Add bookmark'}>
                                            <FaBookmark size={14} />
                                        </button>
                                    )}
                                </div>
                                <h6
                                    style={{
                                        fontSize: '18px',
                                        marginTop: '10px',
                                        fontWeight: '800',
                                        fontFamily: 'Lato',
                                    }}>
                                    {book.title}
                                </h6>
                                <p style={{fontSize: '15px', fontFamily: 'Lato'}}>{book.author}</p>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-muted">No books available.</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-vh-100" style={{backgroundColor: '#FAF6F0', fontFamily: "'Lato', serif", color: '#000000'}}>
            {/* FLOATING CART ICON */}
            <div style={{position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, color: '#7B9EB9'}}>
                <button
                    onClick={() => setShowCartPopup(!showCartPopup)}
                    style={{
                        transition: 'transform 0.2s ease, opacity 0.2s ease',
                        cursor: 'pointer',
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
                        <h6 className="fw-bold mb-3" style={{color: '#7B9EB9', fontFamily: 'Lato'}}>
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
                                        <span
                                            className="fw-bold"
                                            style={{fontSize: '0.85rem', color: '#000000', flexShrink: 0}}>
                                            ${(parseFloat(item.book_price) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}

                                <div
                                    className="d-flex justify-content-between fw-bold mt-2 mb-3"
                                    style={{color: '#7B9EB9'}}>
                                    <span style={{fontFamily: 'Lato'}}>Total</span>
                                    <span style={{color: '#000000', fontFamily: 'Lato'}}>${totalPrice.toFixed(2)}</span>
                                </div>
                            </>
                        )}

                        <button
                            className="btn w-100 text-white fw-bold"
                            style={{fontFamily: 'Lato', backgroundColor: '#7B9EB9', borderRadius: '8px', ...btnHover}}
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

            {/* Toast notification for bookmark messages */}
            {bookmarkMsg && (
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
                    {bookmarkMsg}
                </div>
            )}

            {/* 1. HERO HEADER SECTION */}
            <div className="text-center pt-5 pb-3 px-3">
                <h1
                    className="fw-bold mb-3"
                    style={{
                        fontSize: '2.5rem',
                        letterSpacing: '-0.5px',
                        fontWeight: '800',
                        fontFamily: 'Playfair Display',
                    }}>
                    Find your next favorite book
                </h1>
                <p className="text-muted small mb-4" style={{fontFamily: 'Playfair Display'}}>
                    Read online for everyone — all in one place.
                </p>

                <div className="d-flex justify-content-center gap-2 mb-5">
                    <button
                        className="btn text-white px-4 py-2 fw-medium btn-sm"
                        style={{
                            backgroundColor: '#7B9EB9',
                            fontFamily: 'Lato, serif',
                            fontWeight: 800,
                            borderRadius: '4px',
                            ...btnHover,
                        }}
                        onMouseEnter={handleBtnEnter}
                        onMouseLeave={handleBtnLeave}
                        onClick={() => navigate('/get-started')}>
                        Get started
                    </button>
                    <button
                        className="btn bg-white border px-4 py-2 fw-medium btn-sm"
                        style={{
                            color: '#2D2219',
                            borderRadius: '4px',
                            borderColor: '#EAE5DD',
                            fontWeight: 800,
                            fontFamily: 'Lato',
                            ...btnHover,
                        }}
                        onMouseEnter={handleBtnEnter}
                        onMouseLeave={handleBtnLeave}
                        onClick={() => navigate('/books')}>
                        Browse Books
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT WRAPPER */}
            <div className="container mx-auto px-4 pb-5" style={{maxWidth: '95%'}}>
                {/* 2. FEATURED BOOKS HERO CARD */}
                <div
                    className="p-4 p-md-5 mb-5 rounded-4 border d-flex flex-column flex-md-row align-items-center justify-content-between gap-4"
                    style={{backgroundColor: '#FCFAF5', borderColor: '#E5DFD3', marginTop:-20}}>
                    <div className="text-start" style={{maxWidth: '300px', fontFamily: 'Playfair Display'}}>
                        <h2 className="fw-bold display-6 mb-2">Featured Books</h2>
                        <p className="text-muted small mb-4" style={{fontFamily: 'Lato'}}>
                            Hand-picked reads for every kind of readers
                        </p>
                        <button
                            className="btn text-white px-3 py-2 btn-sm fw-medium"
                            style={{backgroundColor: '#7B9EB9', borderRadius: '4px', fontFamily: 'Lato', ...btnHover}}
                            onMouseEnter={handleBtnEnter}
                            onMouseLeave={handleBtnLeave}
                            onClick={() => navigate('/books')}>
                            Discover more
                        </button>
                    </div>

                    <div className="d-flex gap-3 w-100 justify-content-md-end justify-content-center pt-2">
                        {featuredBooks.map((book, i) => (
                            <img
                                key={i}
                                className="shadow-sm img-fluid"
                                src={book.img}
                                alt={book.title}
                                style={{
                                    borderRadius: '8px',
                                    minWidth: '100px',
                                    height: '380px',
                                    objectFit: 'cover',
                                    transition: 'transform 0.2s ease',
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            />
                        ))}
                    </div>
                </div>

                {/* MOST READ THIS WEEK */}
                {renderBookSection('MOST READ THIS WEEK', mostReadBooks, hoveredMost, setHoveredMost)}

                {/* NEW RELEASES */}
                {renderBookSection('NEW RELEASES', newReleaseBooks, hoveredNew, setHoveredNew)}
            </div>
        </div>
    );
}

export default Home;
