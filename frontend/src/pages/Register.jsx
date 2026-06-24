import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.username.includes(' ')) {
            alert('Username cannot contain spaces!');
            return;
        }

        if (form.password !== form.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const {confirmPassword, ...payload} = form;

        try {
            const apiBase = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${apiBase}/api/register/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Registered Successfully');
                navigate('/login');
            } else {
                if (data.username) alert('Username error: ' + data.username[0]);
                else if (data.email) alert('Email error: ' + data.email[0]);
                else if (data.password) alert('Password error: ' + data.password[0]);
                else alert('Registration failed');
            }
        } catch (error) {
            console.log(error);
            alert('Cannot connect to server');
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
                <h2 style={styles.heading}>Create account</h2>

                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            style={styles.input}
                            placeholder="e.g John Doe"
                            value={form.username}
                            onChange={(e) => setForm({...form, username: e.target.value})}
                        />
                    </div>

                    {/* Email */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            style={styles.input}
                            placeholder="e.g JohnDoe@gmail.com"
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                        />
                    </div>

                    {/* Password */}
                    <div style={styles.formGroup}>
                        <div style={styles.labelRow}>
                            <label style={styles.label}>Password</label>
                        </div>
                        <input
                            type="password"
                            style={styles.input}
                            placeholder="At least 6 characters"
                            value={form.password}
                            onChange={(e) => setForm({...form, password: e.target.value})}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Re-enter password</label>
                        <input
                            type="password"
                            style={styles.input}
                            placeholder="Confirm password"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                        />
                    </div>

                    {/* Create Account button */}
                    <button type="submit" style={styles.btnPrimary}>
                        Create account
                    </button>

                    {/* Terms */}
                    <p style={styles.terms}>
                        By creating an account, you are agreed to our <span style={styles.link}>Terms & Services</span>{' '}
                        and <span style={styles.link}>Policy</span>
                    </p>

                    {/* Divider */}
                    <div style={styles.divider}>
                        <hr style={styles.dividerLine} />
                        <span style={styles.dividerText}>Have an account?</span>
                        <hr style={styles.dividerLine} />
                    </div>

                    {/* Sign in button */}
                    <button type="button" style={styles.btnOutline} onClick={() => navigate('/login')}>
                        Sign in
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
    labelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    terms: {
        fontSize: 12,
        color: '#7a6a5a',
        textAlign: 'center',
        marginBottom: 16,
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
        margin: '16px 0',
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

export default Register;
