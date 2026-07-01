import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaBookOpen} from 'react-icons/fa';

const TABS = ['Library', 'Wishlists', 'Edit Profile'];

export default function Profile() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Library');
    const [saved, setSaved] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [library, setLibrary] = useState([]);
    const [logoutHover, setLogoutHover] = useState(false);

    const token = localStorage.getItem('access');
    const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';
    const API_ROOT = import.meta.env.VITE_API_URL || '';

    const resolveImage = (imgPath) => {
        if (!imgPath) return 'https://via.placeholder.com/200x280?text=No+Cover';
        const img = String(imgPath).trim();
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return `${API_ROOT}${img}`;
        return `${API_ROOT}/${img}`;
    };

    useEffect(() => {
        if (!token) return;
        fetch(`${API_BASE}/purchased/`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((res) => res.json())
            .then((data) => {
                const books = Array.isArray(data) ? data : data.results || [];
                setLibrary(books);
            })
            .catch(() => setLibrary([]));
    }, [token]);

    useEffect(() => {
        if (!token) return;
        fetch(`${API_BASE}/bookmarks/`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((res) => res.json())
            .then((data) => {
                setBookmarks(Array.isArray(data) ? data : data.results || []);
            })
            .catch(() => {});
    }, [token]);

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const profile = {
        username: storedUser.username || 'User',
        email: storedUser.email || '',
        first_name: storedUser.first_name || '',
        last_name: storedUser.last_name || '',
        date_joined: storedUser.date_joined || '2025-01-01',
    };

    const [form, setForm] = useState({...profile});

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const removeBookmark = (id, e) => {
        if (e) e.stopPropagation();
        fetch(`${API_BASE}/bookmarks/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({book: id}),
        })
            .then((res) => {
                if (res.ok) setBookmarks(bookmarks.filter((b) => b.book !== id));
            })
            .catch(() => {});
    };

    const goToBookDetail = (b) => {
        const navWithState = (book) => {
            navigate('/book-detail', {
                state: {
                    id: book.id,
                    img: resolveImage(book.image || b.book_image),
                    title: book.title || b.book_title,
                    author: book.author || b.book_author,
                    price: book.price || b.book_price,
                    description: book.description || '',
                    published: book.published || '',
                    publisher: book.publisher || '',
                    language: book.language || '',
                    pages: book.pages || '',
                    genre: book.category_name || b.book_category || '',
                    isbn: book.isbn || '',
                },
            });
        };
        fetch(`${API_BASE}/books/${b.book}/`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => (data ? navWithState(data) : navWithState(b)))
            .catch(() => navWithState(b));
    };

    const initials =
        profile.first_name && profile.last_name
            ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
            : profile.username.substring(0, 2).toUpperCase();

    const displayName =
        profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : profile.username;

    return (
        <div style={s.page}>
            {/* ── Header ── */}
            <div style={s.header}>
                <div style={s.headerLeft}>
                    <div style={s.avatar}>{initials}</div>
                    <div>
                        <div style={s.heroName}>{displayName}</div>
                        <div style={s.heroSub}>
                            @{profile.username} · since {new Date(profile.date_joined).getFullYear()}
                        </div>
                    </div>
                </div>
                <button
                    style={{
                        ...s.logoutBtn,
                        opacity: logoutHover ? 0.7 : 1,
                    }}
                    onMouseEnter={() => setLogoutHover(true)}
                    onMouseLeave={() => setLogoutHover(false)}
                    onClick={() => {
                        localStorage.clear();
                        navigate('/login');
                    }}>
                    Log out
                </button>
            </div>

            {/* ── Tab bar ── */}
            <div style={s.tabBar}>
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        style={{...s.tab, ...(activeTab === tab ? s.tabActive : {})}}
                        onClick={() => setActiveTab(tab)}>
                        {tab}
                        {tab === 'Library' && library.length > 0 && <span style={s.tabCount}>{library.length}</span>}
                        {tab === 'Wishlists' && bookmarks.length > 0 && (
                            <span style={s.tabCount}>{bookmarks.length}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Content ── */}
            <div style={s.content}>
                {/* LIBRARY */}
                {activeTab === 'Library' && (
                    <div>
                        {library.length === 0 ? (
                            <Empty message="No books yet." cta="Browse books" onClick={() => navigate('/books')} />
                        ) : (
                            <div style={s.grid}>
                                {library.map((book) => (
                                    <BookCard
                                        key={book.id}
                                        book={{
                                            id: book.id,
                                            title: book.title,
                                            author: book.author,
                                            cover: resolveImage(book.image),
                                        }}>
                                        <button
                                            style={s.readBtn}
                                            onClick={() =>
                                                navigate('/reading', {
                                                    state: {
                                                        id: book.id,
                                                        img: resolveImage(book.image),
                                                        title: book.title,
                                                        author: book.author,
                                                        price: book.price,
                                                        description: book.description || '',
                                                    },
                                                })
                                            }>
                                            Read
                                        </button>
                                    </BookCard>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* BOOKMARKS */}
                {activeTab === 'Wishlists' && (
                    <div>
                        {bookmarks.length === 0 ? (
                            <Empty message="Nothing saved yet." cta="Browse books" onClick={() => navigate('/books')} />
                        ) : (
                            <div style={s.grid}>
                                {bookmarks.map((b) => (
                                    <div key={b.id} onClick={() => goToBookDetail(b)} style={{cursor: 'pointer'}}>
                                        <BookCard
                                            book={{
                                                id: b.book,
                                                title: b.book_title,
                                                author: b.book_author,
                                                cover: resolveImage(b.book_image),
                                            }}>
                                            <button style={s.removeBtn} onClick={(e) => removeBookmark(b.book, e)}>
                                                Remove
                                            </button>
                                        </BookCard>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* EDIT PROFILE */}
                {activeTab === 'Edit Profile' && (
                    <form onSubmit={handleSave} style={s.editForm}>
                        <div style={s.formRow}>
                            <Field
                                label="First name"
                                value={form.first_name}
                                onChange={(v) => setForm({...form, first_name: v})}
                            />
                            <Field
                                label="Last name"
                                value={form.last_name}
                                onChange={(v) => setForm({...form, last_name: v})}
                            />
                        </div>
                        <Field
                            label="Username"
                            value={form.username}
                            onChange={(v) => setForm({...form, username: v})}
                        />
                        <Field
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={(v) => setForm({...form, email: v})}
                        />

                        <div style={s.divider} />
                        <p style={s.sectionLabel}>Change password</p>

                        <Field label="Current password" type="password" value="" onChange={() => {}} />
                        <Field label="New password" type="password" value="" onChange={() => {}} />
                        <Field label="Confirm new password" type="password" value="" onChange={() => {}} />

                        <button type="submit" style={s.saveBtn}>
                            {saved ? '✓ Saved' : 'Save changes'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function BookCard({book, children}) {
    return (
        <div style={s.card}>
            <img
                src={book.cover}
                alt={book.title}
                style={s.cover}
                onError={(e) => {
                    e.target.style.background = '#E8E0D5';
                    e.target.src = '';
                }}
            />
            <div style={s.cardBody}>
                <div style={s.cardTitle}>{book.title}</div>
                <div style={s.cardAuthor}>{book.author}</div>
                <div style={{marginTop: 'auto', paddingTop: 10}}>{children}</div>
            </div>
        </div>
    );
}

function Field({label, value, onChange, type = 'text'}) {
    return (
        <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>{label}</label>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={s.fieldInput} />
        </div>
    );
}

function Empty({message, cta, onClick}) {
    return (
        <div style={s.empty}>
            <div style={s.emptyIcon}>
                <FaBookOpen />
            </div>
            <p style={s.emptyMsg}>{message}</p>
            <button style={s.emptyBtn} onClick={onClick}>
                {cta}
            </button>
        </div>
    );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const CREAM = '#FAF7F2';
const BROWN = '#3D3224';
const BROWN_MID = '#6B5744';
const BLUE = '#2E4A5A';
const BLUE_LIGHT = '#7B9EB9';
const BORDER = '#E5DED4';

const s = {
    page: {
        background: CREAM,
        fontFamily: "'Lato', sans-serif",
        color: BROWN,
        minHeight: '100vh',
    },

    // header
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '32px 48px 28px',
        borderBottom: `1px solid ${BORDER}`,
        background: CREAM,
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: BLUE,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Playfair Display', serif",
        fontSize: 16,
        fontWeight: 700,
        flexShrink: 0,
    },
    heroName: {
        fontFamily: "'Playfair Display', serif",
        fontSize: 18,
        fontWeight: 700,
        color: BROWN,
        lineHeight: 1.2,
    },
    heroSub: {
        fontSize: 12,
        color: BROWN_MID,
        marginTop: 2,
    },
    logoutBtn: {
        background: 'transparent',
        border: `1px solid ${BORDER}`,
        borderRadius: 6,
        padding: '7px 16px',
        fontSize: 13,
        fontWeight: 600,
        color: BROWN_MID,
        cursor: 'pointer',
        transition: 'opacity .15s',
        fontFamily: "'Lato', sans-serif",
    },

    // tabs
    tabBar: {
        display: 'flex',
        padding: '0 48px',
        background: CREAM,
        borderBottom: `1px solid ${BORDER}`,
        gap: 0,
    },
    tab: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '14px 18px',
        background: 'transparent',
        border: 'none',
        borderBottom: '2px solid transparent',
        fontSize: 13,
        fontWeight: 600,
        color: BROWN_MID,
        cursor: 'pointer',
        fontFamily: "'Lato', sans-serif",
        transition: 'color .15s',
        letterSpacing: '0.3px',
    },
    tabActive: {
        color: BLUE,
        borderBottomColor: BLUE,
    },
    tabCount: {
        background: BLUE_LIGHT,
        color: '#fff',
        fontSize: 10,
        fontWeight: 700,
        padding: '1px 6px',
        borderRadius: 20,
    },

    // content
    content: {
        maxWidth: 860,
        margin: '0 auto',
        padding: '36px 48px',
    },

    // book grid
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 20,
    },
    card: {
        background: '#fff',
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    cover: {
        width: '100%',
        aspectRatio: '1.8/2.8',
        objectFit: 'cover',
        background: '#E8E0D5',
        display: 'block',
    },
    cardBody: {
        padding: '12px 14px 14px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    cardTitle: {
        fontFamily: "'Playfair Display', serif",
        fontSize: 13,
        fontWeight: 600,
        color: BROWN,
        marginBottom: 3,
        lineHeight: 1.3,
    },
    cardAuthor: {
        fontSize: 11,
        color: BROWN_MID,
    },
    removeBtn: {
        background: 'transparent',
        border: 'none',
        padding: '4px 0',
        fontSize: 12,
        color: '#b03a2e',
        cursor: 'pointer',
        fontFamily: "'Lato', sans-serif",
        textAlign: 'left',
    },
    readBtn: {
        width: '100%',
        padding: '7px 0',
        background: BLUE,
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: "'Lato', sans-serif",
    },

    // edit form
    editForm: {
        maxWidth: 480,
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
    },
    fieldGroup: {
        marginBottom: 14,
    },
    fieldLabel: {
        display: 'block',
        fontSize: 12,
        color: BROWN_MID,
        marginBottom: 6,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    fieldInput: {
        width: '100%',
        padding: '10px 14px',
        border: `1px solid ${BORDER}`,
        borderRadius: 6,
        fontFamily: "'Lato', sans-serif",
        fontSize: 14,
        color: BROWN,
        background: '#fff',
        outline: 'none',
        boxSizing: 'border-box',
    },
    divider: {
        borderTop: `1px solid ${BORDER}`,
        margin: '24px 0 20px',
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: 700,
        color: BROWN_MID,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: 14,
    },
    saveBtn: {
        marginTop: 8,
        padding: '10px 28px',
        background: BLUE,
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontFamily: "'Lato', sans-serif",
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
    },

    // empty state
    empty: {
        textAlign: 'center',
        padding: '80px 20px',
    },
    emptyIcon: {
        fontSize: 32,
        color: BORDER,
        marginBottom: 12,
    },
    emptyMsg: {
        fontSize: 14,
        color: BROWN_MID,
        marginBottom: 20,
    },
    emptyBtn: {
        padding: '9px 22px',
        background: BLUE,
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontFamily: "'Lato', sans-serif",
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
    },
};