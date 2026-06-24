import {useNavigate} from 'react-router-dom';

function FirstLogin() {
    const navigate = useNavigate();

    return (
        <div style={styles.page}>
            {/* LOGO */}
            <div style={styles.logoWrap}>
                <div style={styles.logo}>Booklet</div>
                <div style={styles.tagline}>Your favorite books, one place</div>
            </div>

            {/* HEADING */}
            <h1 style={styles.heading}>Read your favorite book.</h1>

            {/* BUTTONS */}
            <div style={styles.btnGroup}>
                <button style={styles.btnDark} onClick={() => navigate('/register')}>
                    Continue with phone number
                </button>
                <button style={styles.btnMid} onClick={() => navigate('/register')}>
                    Continue with Gmail
                </button>
                <button style={styles.btnOutline} onClick={() => navigate('/register')}>
                    Continue with Apple
                </button>
            </div>

            {/* TERMS */}
            <p style={styles.terms}>
                By creating an account, you are agreed to our <span style={styles.link}>Terms & Services</span> and{' '}
                <span style={styles.link}>Policy</span>
            </p>

            {/* SIGN IN */}
            <p style={styles.signin}>
                Already a member?{' '}
                <span style={styles.link} onClick={() => navigate('/login')}>
                    Sign in
                </span>
            </p>

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
        marginBottom: 40,
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
    heading: {
        fontFamily: "'Playfair Display', serif",
        fontSize: 30,
        fontWeight: 700,
        color: '#2E4A5A',
        textAlign: 'center',
        marginBottom: 32,
    },
    btnGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        maxWidth: 400,
        marginBottom: 16,
    },
    btnDark: {
        width: '100%',
        padding: '13px',
        background: '#2E4A5A',
        color: 'white',
        border: 'none',
        borderRadius: 50,
        fontFamily: "'Lato', sans-serif",
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
    },
    btnMid: {
        width: '100%',
        padding: '13px',
        background: '#8a9a9e',
        color: 'white',
        border: 'none',
        borderRadius: 50,
        fontFamily: "'Lato', sans-serif",
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
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
        fontWeight: 600,
        cursor: 'pointer',
    },
    terms: {
        fontSize: 12,
        color: '#7a6a5a',
        textAlign: 'center',
        marginBottom: 8,
        maxWidth: 400,
    },
    signin: {
        fontSize: 13,
        color: '#7a6a5a',
        textAlign: 'center',
        marginBottom: 60,
    },
    link: {
        color: '#2E4A5A',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    footer: {
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

export default FirstLogin;
