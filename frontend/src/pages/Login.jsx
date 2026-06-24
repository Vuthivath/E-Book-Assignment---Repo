import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert('Please enter username and password');
            return;
        }
        try {
            const apiBase = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${apiBase}/api/login/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password}),
            });
            const data = await res.json();
            console.log('Login response:', data);
            if (res.ok) {
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);
                localStorage.setItem('user', JSON.stringify(data.user));
                if (data.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    const from = localStorage.getItem('redirectAfter') || '/books';
                    localStorage.removeItem('redirectAfter');
                    navigate(from);
                }
            } else {
                alert(data.error || data.detail || 'Login failed');
            }
        } catch (error) {
            console.log('Network error:', error);
            alert('Cannot connect to server. Make sure Django is running.');
        }
    };

    return (
        <div style={styles.page}>
            {/* LOGO */}
            <div style={styles.logoWrap}>
                <div style={styles.logo}>Booklet</div>
                <div style={styles.tagline}>Your favorite books, one place</div>
            </div>

            {/* CARD */}
            <div style={styles.card}>
                <h2 style={styles.heading}>Sign in</h2>

                <form onSubmit={handleLogin}>
                    {/* Email */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="text"
                            style={styles.input}
                            placeholder=""
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            style={styles.input}
                            placeholder=""
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div style={styles.forgotWrap}>
                            <span style={styles.forgotLink}>Forgot your password?</span>
                        </div>
                    </div>

                    {/* Sign in button */}
                    <button type="submit" style={styles.btnPrimary}>
                        Sign in
                    </button>

                    {/* Checkboxes */}
                    <div style={styles.checkRow}>
                        <input type="checkbox" id="terms" style={{marginRight: 8}} />
                        <label htmlFor="terms" style={styles.checkLabel}>
                            By signing in you agree to our <span style={styles.link}>Terms & Services</span> and{' '}
                            <span style={styles.link}>Privacy Policy</span>
                        </label>
                    </div>

                    <div style={styles.checkRow}>
                        <input type="checkbox" id="keep" style={{marginRight: 8}} />
                        <label htmlFor="keep" style={styles.checkLabel}>
                            Keep me signed in
                        </label>
                    </div>

                    {/* Divider */}
                    <div style={styles.divider}>
                        <hr style={styles.dividerLine} />
                        <span style={styles.dividerText}>Don't have an account?</span>
                        <hr style={styles.dividerLine} />
                    </div>

                    {/* Sign up button */}
                    <button type="button" style={styles.btnOutline} onClick={() => navigate('/register')}>
                        Sign up
                    </button>
                </form>
            </div>

            {/* FOOTER */}
            <div style={styles.footer}>
                <div style={styles.footerLinks}>
                    <span style={styles.footerLink}>Terms & Services</span>
                    <span style={styles.footerLink}>Privacy</span>
                    <span style={styles.footerLink}>Help</span>
                </div>
                <div style={styles.footerCopy}>© Booklet. All right reserved.</div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '90vh',
        background: '#FAF7F2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Lato', sans-serif",
        padding: '40px 24px',
    },
    logoWrap: {
        textAlign: 'center',
        marginBottom: 20,
    },
    logo: {
        fontFamily: "'Playfair Display', serif",
        fontSize: 32,
        fontWeight: 700,
        color: '#2E4A5A',
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 13,
        color: '#7a6a5a',
        marginTop: 4,
    },
    card: {
        background: '#FAF7F2',
        width: '100%',
        maxWidth: 440,
    },
    heading: {
        fontFamily: "'Playfair Display', serif",
        fontSize: 28,
        fontWeight: 700,
        color: '#2E4A5A',
        textAlign: 'center',
        marginBottom: 16,
    },
    formGroup: {
        marginBottom: 8,
    },
    label: {
        display: 'block',
        fontSize: 13,
        color: '#3D3224',
        marginBottom: 6,
        fontWeight: 400,
    },
    input: {
        width: '100%',
        padding: '11px 14px',
        border: '1.5px solid #c8bfb5',
        borderRadius: 50,
        fontFamily: "'Lato', sans-serif",
        fontSize: 14,
        color: '#2E4A5A',
        background: '#FAF7F2',
        outline: 'none',
        boxSizing: 'border-box',
    },
    forgotWrap: {
        textAlign: 'right',
        marginTop: 6,
    },
    forgotLink: {
        fontSize: 12,
        color: '#2E4A5A',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
    btnPrimary: {
        width: '100%',
        padding: '13px',
        background: '#2E4A5A',
        color: 'white',
        border: 'none',
        borderRadius: 50,
        fontFamily: "'Lato', sans-serif",
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        marginTop: 4,
        marginBottom: 6,
    },
    checkRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 8,
    },
    checkLabel: {
        fontSize: 12,
        color: '#7a6a5a',
    },
    link: {
        color: '#2E4A5A',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: '20px 0',
    },
    dividerLine: {
        flex: 1,
        border: 'none',
        borderTop: '1px solid #e5ded4',
    },
    dividerText: {
        fontSize: 13,
        color: '#7a6a5a',
        whiteSpace: 'nowrap',
    },
    btnOutline: {
        width: '100%',
        padding: '13px',
        background: 'transparent',
        color: '#2E4A5A',
        border: '1.5px solid #c8bfb5',
        borderRadius: 50,
        fontFamily: "'Lato', sans-serif",
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
    },
    footer: {
        marginTop: 48,
        textAlign: 'center',
    },
    footerLinks: {
        display: 'flex',
        gap: 20,
        justifyContent: 'center',
        marginBottom: 6,
    },
    footerLink: {
        fontSize: 12,
        color: '#7a6a5a',
        cursor: 'pointer',
    },
    footerCopy: {
        fontSize: 12,
        color: '#7a6a5a',
    },
};

export default Login;
