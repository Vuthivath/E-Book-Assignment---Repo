const About = () => {
    return (
        <div>
            {/* Our Goal Section */}
            <div style={{backgroundColor: '#FAF7F2', padding: '60px 0'}}>
                <div className="container">
                    <p className="fw-bold mb-1" style={{fontSize: '13px', letterSpacing: '2px', color: '#7B9EB9'}}>
                        OUR GOAL
                    </p>
                    <h2
                        className="fw-bold mb-3"
                        style={{fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#2C1F0F'}}>
                        One platform for every books you need
                    </h2>
                    <p className="mb-4" style={{color: '#555', fontSize: '15px', maxWidth: '700px'}}>
                        Booklet was made to connect between readers and the books they love. Allow them to read online —
                        we make it simple, fast, and accessible from one place.
                    </p>
                    <div className="row g-4">
                        {/* For Readers Card */}
                        <div className="col-lg-6">
                            <div
                                className="p-4 h-100"
                                style={{backgroundColor: '#7B9EB9', borderRadius: '8px', color: 'white'}}>
                                <p className="fw-bold mb-3" style={{letterSpacing: '2px', fontSize: '13px'}}>
                                    FOR READERS
                                </p>
                                <p style={{fontSize: '14px', lineHeight: '1.8', opacity: 0.9}}>
                                    Browse & read online — all without switching between different platforms. Your next
                                    favorite book is always one click away. Discover new titles through curated
                                    recommendations, explore genres at your own pace, and keep track of everything
                                    you've read or want to read next. Whether you're a casual reader or someone who
                                    finishes a book a week, Booklet fits around your reading habits — not the other way
                                    around.
                                </p>
                            </div>
                        </div>
                        {/* For Bookstores Card */}
                        <div className="col-lg-10 offset-lg-2">
                            <div
                                className="p-4"
                                style={{backgroundColor: '#7B9EB9', borderRadius: '8px', color: 'white'}}>
                                <p className="fw-bold mb-3" style={{letterSpacing: '2px', fontSize: '13px'}}>
                                    FOR BOOKSTORES
                                </p>
                                <p style={{fontSize: '14px', lineHeight: '1.8', opacity: 0.9}}>
                                    Manage your inventory, track orders, and reach more customers through a single
                                    streamlined system. List your books, set your prices, and monitor sales all from one
                                    dashboard. No complicated setup, no juggling multiple tools — just a straightforward
                                    way to run your bookstore and focus on what you actually love doing.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default About;