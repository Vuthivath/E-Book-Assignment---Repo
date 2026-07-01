import {FaEnvelope, FaPhone, FaMapMarkerAlt} from 'react-icons/fa';
import { useState } from 'react';

const Contact = () => {
    const [rickRolled, setRickRolled] = useState(false);
    return (
        <div style={{backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '60px 0'}}>
            {rickRolled && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.9)',
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 16,
                    }}>
                    <img
                        src="https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif"
                        style={{width: '500px', borderRadius: '12px'}}
                    />
                    <button
                        onClick={() => setRickRolled(false)}
                        style={{
                            color: '#fff',
                            background: 'transparent',
                            border: '1px solid #fff',
                            borderRadius: '6px',
                            padding: '8px 20px',
                        }}>
                        Close
                    </button>
                </div>
            )}
            <div className="container">
                <div className="row g-5">
                    {/* Left: Contact Info */}
                    <div className="col-lg-5">
                        <p className="fw-bold mb-2" style={{color: '#7B9EB9', fontSize: '13px', letterSpacing: '2px'}}>
                            CONTACT INFO
                        </p>
                        <h2
                            className="fw-bold mb-3"
                            style={{fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#2C1F0F'}}>
                            We're here to help
                        </h2>
                        <p style={{color: '#555', fontSize: '14px'}} className="mb-4">
                            Weather you have a question about book listing, any problems or just wanna say hello - where
                            are here to help
                        </p>

                        {/* Info Cards */}
                        {[
                            {
                                icon: <FaEnvelope size={20} color="white" />,
                                label: 'Email',
                                bold: 'Booklet@gmail.com',
                                sub: 'We reply within 24 hours',
                            },
                            {
                                icon: <FaPhone size={20} color="white" />,
                                label: 'Phone',
                                bold: '077 889 456',
                                sub: 'Mon-Fri, 8AM - 7AM',
                            },
                            {
                                icon: <FaMapMarkerAlt size={20} color="white" />,
                                label: 'Address',
                                bold: 'Phnom Penh, Cambodia',
                                sub: 'National Road 3, Unknown',
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="d-flex align-items-center gap-3 p-3 mb-3"
                                style={{border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white'}}>
                                <div style={{backgroundColor: '#7B2FBE', padding: '14px', borderRadius: '6px'}}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="mb-0" style={{fontSize: '12px', color: '#888'}}>
                                        {item.label}
                                    </p>
                                    <p className="mb-0 fw-bold" style={{fontSize: '14px', color: '#2C1F0F'}}>
                                        {item.bold}
                                    </p>
                                    <p className="mb-0" style={{fontSize: '12px', color: '#888'}}>
                                        {item.sub}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Form */}
                    <div className="col-lg-7">
                        <div
                            className="p-4"
                            style={{backgroundColor: 'white', borderRadius: '12px', border: '1px solid #ddd'}}>
                            <h4
                                className="fw-bold mb-1"
                                style={{fontFamily: 'Playfair Display, serif', color: '#2C1F0F'}}>
                                Send us a message
                            </h4>
                            <p className="mb-4" style={{fontSize: '13px', color: '#888'}}>
                                Fill out the form and we'll get back to you shortly.
                            </p>

                            <div className="row g-3">
                                <div className="col-6">
                                    <label className="fw-bold mb-1" style={{fontSize: '13px'}}>
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="John"
                                        style={{backgroundColor: '#FAF7F2', border: '1px solid #ddd'}}
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="fw-bold mb-1" style={{fontSize: '13px'}}>
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Doe"
                                        style={{backgroundColor: '#FAF7F2', border: '1px solid #ddd'}}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="fw-bold mb-1" style={{fontSize: '13px'}}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="JohnDoe@gmail.com"
                                        style={{backgroundColor: '#FAF7F2', border: '1px solid #ddd'}}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="fw-bold mb-1" style={{fontSize: '13px'}}>
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Subscription issues, Book request..."
                                        style={{backgroundColor: '#FAF7F2', border: '1px solid #ddd'}}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="fw-bold mb-1" style={{fontSize: '13px'}}>
                                        Message
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows={6}
                                        placeholder="Write your message here..."
                                        style={{backgroundColor: '#FAF7F2', border: '1px solid #ddd'}}
                                    />
                                </div>
                                <div className="col-12">
                                    <button
                                        className="w-100 py-2 border-0 text-white fw-bold"
                                        style={{backgroundColor: '#7B9EB9', borderRadius: '6px', fontSize: '15px'}}
                                        onClick={() => setRickRolled(true)}>
                                        Send Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
