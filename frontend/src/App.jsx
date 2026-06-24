import {BrowserRouter, Routes, Route, Link, useLocation} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Books from './pages/Book';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AddToCart from './pages/AddToCart';
import BookDetail from './pages/BookDetail';
import Reading from './pages/Reading';
import GetStart from './pages/GetStart';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import PrivateRoute from './PrivateRoute';
import {FaFacebook, FaInstagram, FaDiscord, FaShoppingCart} from 'react-icons/fa';

function AppLayout() {
    const location = useLocation();
    const isReading = location.pathname === '/reading';
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="w-auto">
            {/* Navbar - hidden on reading page */}
            {!isReading && (
                <nav
                    className="navbar navbar-expand-lg navbar-dark shadow-sm py-3 sticky-top no-print"
                    style={{backgroundColor: '#2E4A5A'}}>
                    <div className="container">
                        <Link
                            className="navbar-brand fw-bold fs-3"
                            style={{fontFamily: 'Playfair Display, serif', color: '#FAF7F2'}}
                            to="/">
                            Booklet
                        </Link>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav mx-auto align-items-center gap-4">
                                {['/', '/books', '/about', '/contact'].map((path, i) => {
                                    const labels = ['Home', 'Books', 'About', 'Contact'];
                                    return (
                                        <li className="nav-item" key={path}>
                                            <Link
                                                className="nav-link fw-semibold"
                                                style={{color: 'rgba(250,247,242,0.85)', textDecoration: 'none'}}
                                                to={path}>
                                                {labels[i]}
                                            </Link>
                                        </li>
                                    );
                                })}
                                <li className="nav-item">
                                    <Link className="nav-link" style={{color: 'rgba(250,247,242,0.85)'}} to="/cart">
                                        <FaShoppingCart size={22} />
                                    </Link>
                                </li>
                            </ul>

                            {/* Auth */}
                            <ul className="navbar-nav align-items-center gap-2">
                                {!user ? (
                                    <li className="nav-item">
                                        <Link
                                            to="/get-started"
                                            style={{
                                                backgroundColor: '#7B9EB9',
                                                color: 'white',
                                                padding: '9px 22px',
                                                borderRadius: '50px',
                                                fontWeight: 700,
                                                fontSize: '14px',
                                                textDecoration: 'none',
                                                display: 'inline-block',
                                                border: 'none',
                                                fontFamily: 'Lato, sans-serif',
                                            }}>
                                            Get Started
                                        </Link>
                                    </li>
                                ) : (
                                    <li className="nav-item">
                                        <Link
                                            to="/profile"
                                            className="d-flex align-items-center gap-2 text-decoration-none"
                                            style={{cursor: 'pointer'}}>
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold border border-2 border-white shadow"
                                                style={{
                                                    width: '38px',
                                                    height: '38px',
                                                    backgroundColor: '#7B9EB9',
                                                    color: 'white',
                                                    fontFamily: 'Lato, sans-serif',
                                                    fontSize: '13px',
                                                }}>
                                                {user?.username?.substring(0, 2).toUpperCase() || '?'}
                                            </div>
                                            <span
                                                style={{
                                                    color: '#FAF7F2',
                                                    fontWeight: 700,
                                                    fontSize: '15px',
                                                    fontFamily: 'Lato, sans-serif',
                                                }}>
                                                Hi, {user?.username || 'User'}
                                            </span>
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
            )}

            {/* Pages */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/books" element={<Books />} />
                <Route path="/contact" element={<Contact />} />
                <Route
                    path="/cart"
                    element={
                        <PrivateRoute>
                            <AddToCart />
                        </PrivateRoute>
                    }
                />
                <Route path="/book-detail" element={<BookDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/reading"
                    element={
                        <PrivateRoute>
                            <Reading />
                        </PrivateRoute>
                    }
                />
                <Route path="/get-started" element={<GetStart />} />
                <Route path="/profile" element={<Profile />}></Route>
                <Route
                    path="/checkout"
                    element={
                        <PrivateRoute>
                            <Checkout />
                        </PrivateRoute>
                    }
                />
            </Routes>

            {/* Footer - hidden on reading page */}
            {!isReading && (
                <footer style={{backgroundColor: '#2E4A5A'}} className="text-white py-4 no-print">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p
                                    className="fw-bold mb-2"
                                    style={{letterSpacing: '2px', fontSize: '13px', fontFamily: 'Lato'}}>
                                    FOLLOW BOOKLET
                                </p>
                                <div className="d-flex gap-2">
                                    <a
                                        href="#"
                                        style={{
                                            backgroundColor: '#4383eb',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            color: 'white',
                                        }}>
                                        <FaFacebook size={20} />
                                    </a>
                                    <a
                                        href="#"
                                        style={{
                                            backgroundColor: '#e44b62',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            color: 'white',
                                        }}>
                                        <FaInstagram size={20} />
                                    </a>
                                    <a
                                        href="#"
                                        style={{
                                            backgroundColor: '#7B2FBE',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            color: 'white',
                                        }}>
                                        <FaDiscord size={20} />
                                    </a>
                                </div>
                            </div>

                            <div className="d-flex gap-4 align-items-center">
                                {['HOME', 'BOOKS', 'ABOUT', 'CONTACT'].map((item) => (
                                    <Link
                                        key={item}
                                        to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                                        className="text-white text-decoration-none"
                                        style={{fontSize: '13px', letterSpacing: '1px'}}>
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <hr style={{borderColor: 'rgba(255,255,255,0.3)', margin: '16px 0'}} />

                        <div className="d-flex justify-content-end align-items-center">
                            <div>
                                <h2
                                    className="fw-bold mb-1"
                                    style={{fontFamily: 'Playfair Display, serif', fontSize: '2rem'}}>
                                    Booklet
                                </h2>
                                <p className="mb-0" style={{fontSize: '12px'}}>
                                    Your favorite books, one place
                                </p>
                                <p
                                    className="mb-0"
                                    style={{fontSize: '10px', opacity: 0.7, fontFamily: 'Playfair Display, serif'}}>
                                    © Booklet. All right reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            )}

            {/* Fix Bootstrap yellow hover on nav links */}
            <style>{`
                .nav-link:hover, .nav-link:focus {
                    color: white !important;
                    opacity: 1 !important;
                }
                .navbar-brand:hover, .navbar-brand:focus {
                    color: #FAF7F2 !important;
                }
            `}</style>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    );
}

export default App;
