import {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {FaCog} from 'react-icons/fa';

const PARAGRAPHS_PER_PAGE = 2;

const themes = {
    light: {
        bg: '#FAF7F2',
        text: '#4a3a2a',
        topBar: '#2E4A5A',
        bottomBar: '#ffffff',
        border: '#e5ded4',
        panel: '#ffffff',
    },
    sepia: {
        bg: '#f4e4c1',
        text: '#5c3d1a',
        topBar: '#3D3224',
        bottomBar: '#ede0c4',
        border: '#d4bc8a',
        panel: '#faf0d8',
    },
    dark: {
        bg: '#1a1a2e',
        text: '#ececec',
        topBar: '#0f0f1e',
        bottomBar: '#0f0f1e',
        border: '#2e2e4e',
        panel: '#22223a',
    },
};

export default function ReadingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const bookState = location.state;

    const [fontSize, setFontSize] = useState(17);
    const [theme, setTheme] = useState('light');
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [checkingAccess, setCheckingAccess] = useState(true);

    const token = localStorage.getItem('access');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const API_BASE_API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

    // Guard: only logged-in users who bought this book can access
    useEffect(() => {
        if (!token || !user) {
            navigate('/login');
            return;
        }
        if (!bookState?.id) {
            navigate('/');
            return;
        }
        fetch(`${API_BASE_API}/books/${bookState.id}/purchased/`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((res) => {
                if (!res.ok) throw new Error('Auth failed');
                return res.json();
            })
            .then((data) => {
                if (!data.purchased) {
                    navigate('/book-detail', {state: bookState});
                } else {
                    setCheckingAccess(false);
                }
            })
            .catch(() => {
                navigate('/');
            });
    }, []);

    // TODO: fetch chapters from API when backend is ready
    // const [chapters, setChapters] = useState([]);
    // useEffect(() => {
    //     const bookId = bookState?.id;
    //     if (bookId) {
    //         fetch(`${API_BASE_API}/books/${bookId}/chapters/`)
    //             .then((r) => r.json())
    //             .then((data) => setChapters(data));
    //     }
    // }, [bookState?.id]);

    const chapters = [];
    const totalPages = Math.ceil(chapters.length / PARAGRAPHS_PER_PAGE) || 1;
    const progress = Math.round((page / totalPages) * 100);
    const currentParagraphs = chapters.slice((page - 1) * PARAGRAPHS_PER_PAGE, page * PARAGRAPHS_PER_PAGE);

    const t = themes[theme];

    const styles = {
        body: {
            fontFamily: "'Lato', sans-serif",
            background: t.bg,
            color: t.text,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background 0.3s, color 0.3s',
        },
        topBar: {
            background: t.topBar,
            padding: '14px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        },
        backBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#FAF7F2',
            fontSize: 13,
            cursor: 'pointer',
            opacity: 0.75,
            background: 'none',
            border: 'none',
            fontFamily: "'Lato', sans-serif",
        },
        bookTitleBar: {
            fontFamily: "'Playfair Display', serif",
            fontSize: 15,
            color: '#FAF7F2',
            fontWeight: 600,
            opacity: 0.9,
        },
        topBarRight: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            position: 'relative',
        },
        iconBtn: {
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#FAF7F2',
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        progressWrap: {
            background: t.border,
            height: 3,
            width: '100%',
        },
        progressFill: {
            background: '#7B9EB9',
            height: 3,
            width: `${progress}%`,
            transition: 'width 0.3s',
        },
        readingArea: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            padding: '50px 24px 100px',
            background: t.bg,
        },
        readingContent: {
            maxWidth: 680,
            width: '100%',
        },
        readingText: {
            fontSize: fontSize,
            lineHeight: 1.9,
            color: t.text,
            textAlign: 'justify',
            transition: 'font-size 0.2s',
        },
        bottomBar: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: t.bottomBar,
            borderTop: `1px solid ${t.border}`,
            padding: '14px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 100,
        },
        navBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: `1.5px solid ${t.border}`,
            color: t.text,
            padding: '9px 20px',
            borderRadius: 50,
            fontFamily: "'Lato', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
        },
        navBtnNext: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#7B9EB9',
            border: '1.5px solid #7B9EB9',
            color: 'white',
            padding: '9px 20px',
            borderRadius: 50,
            fontFamily: "'Lato', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
        },
        pageInfo: {textAlign: 'center'},
        pageNum: {
            fontFamily: "'Playfair Display', serif",
            fontSize: 15,
            fontWeight: 600,
            color: t.text,
        },
        pageTotal: {fontSize: 11, color: '#7a6a5a', marginTop: 2},
        settingsPanel: {
            position: 'absolute',
            top: 44,
            right: 0,
            background: t.panel,
            border: `1px solid ${t.border}`,
            borderRadius: 14,
            padding: 20,
            width: 240,
            boxShadow: '0 8px 30px rgba(61,50,36,0.15)',
            zIndex: 200,
        },
        settingsTitle: {
            fontFamily: "'Playfair Display', serif",
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 16,
            color: t.text,
        },
        settingRow: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        settingLabel: {fontSize: 13, color: '#7a6a5a'},
        sizeControls: {display: 'flex', alignItems: 'center', gap: 10},
        sizeBtn: {
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: `1.5px solid ${t.border}`,
            background: t.bg,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: t.text,
        },
        themeOptions: {display: 'flex', gap: 8},
    };

    if (checkingAccess) {
        return (
            <div
                style={{
                    ...styles.body,
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                }}>
                <p style={{fontSize: 16, color: '#7a6a5a'}}>Checking access...</p>
            </div>
        );
    }

    return (
        <div style={styles.body}>
            {/* TOP BAR */}
            <div style={styles.topBar}>
                <button style={styles.backBtn} onClick={() => navigate('/profile', {state: bookState})}>
                    ← Back
                </button>
                <div style={styles.bookTitleBar}>{bookState?.title || 'Reading'}</div>
                <div style={styles.topBarRight}>
                    <button style={styles.iconBtn} onClick={() => setSettingsOpen(!settingsOpen)}>
                        <FaCog size={16} />
                    </button>

                    {/* SETTINGS PANEL */}
                    {settingsOpen && (
                        <div style={styles.settingsPanel}>
                            <div style={styles.settingsTitle}>Reading Settings</div>

                            {/* Font Size */}
                            <div style={styles.settingRow}>
                                <span style={styles.settingLabel}>Font Size</span>
                                <div style={styles.sizeControls}>
                                    <button
                                        style={styles.sizeBtn}
                                        onClick={() => setFontSize((f) => Math.max(13, f - 1))}>
                                        −
                                    </button>
                                    <span style={{fontSize: 13, fontWeight: 700, color: t.text}}>{fontSize}</span>
                                    <button
                                        style={styles.sizeBtn}
                                        onClick={() => setFontSize((f) => Math.min(24, f + 1))}>
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Theme */}
                            <div style={styles.settingRow}>
                                <span style={styles.settingLabel}>Theme</span>
                                <div style={styles.themeOptions}>
                                    {['light', 'sepia', 'dark'].map((th) => (
                                        <div
                                            key={th}
                                            onClick={() => setTheme(th)}
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                background:
                                                    th === 'light' ? '#FAF7F2' : th === 'sepia' ? '#f4e4c1' : '#1a1a2e',
                                                border: theme === th ? '2px solid #7B9EB9' : `2px solid ${t.border}`,
                                                transition: 'border-color 0.2s',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* PROGRESS BAR */}
            <div style={styles.progressWrap}>
                <div style={styles.progressFill} />
            </div>

            {/* READING AREA */}
            <div style={styles.readingArea}>
                <div style={styles.readingContent}>
                    {currentParagraphs.length > 0 ? (
                        <div style={styles.readingText}>
                            {currentParagraphs.map((para, i) => (
                                <p key={i} style={{marginBottom: 24}}>
                                    {para}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <div
                            style={{
                                textAlign: 'center',
                                marginTop: 80,
                                color: '#7a6a5a',
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 18,
                            }}>
                            <p>Content coming soon.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div style={styles.bottomBar}>
                <button
                    style={page <= 1 ? {...styles.navBtn, opacity: 0.3, cursor: 'default'} : styles.navBtn}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    ← Previous
                </button>
                <div style={styles.pageInfo}>
                    <div style={styles.pageNum}>Page {page}</div>
                    <div style={styles.pageTotal}>
                        of {totalPages} pages · {progress}% complete
                    </div>
                </div>
                <button
                    style={
                        page >= totalPages ? {...styles.navBtnNext, opacity: 0.3, cursor: 'default'} : styles.navBtnNext
                    }
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                    Next →
                </button>
            </div>
        </div>
    );
}
