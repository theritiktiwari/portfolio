import React from 'react'

const Footer = () => {

    let year = new Date().getFullYear();
    year %= 100;

    return (
        <footer className="footer">
            <div className="thanks">
                <h2>Thank You For Giving The Time</h2>
                <h1>!! Have a Good Day !!</h1>
            </div>
            <hr />
            <div className="container">
                <div className="social">
                    <ul>
                        <a href="https://linkedin.com/in/theritiktiwari" target="_blank" rel="noreferrer"><li><i className="fab fa-linkedin-in"></i></li></a>
                        <a href="https://github.com/theritiktiwari" target="_blank" rel="noreferrer"><li><i className="fab fa-github"></i></li></a>
                        <a href="https://instagram.com/theritiktiwari" target="_blank" rel="noreferrer"><li><i className="fab fa-instagram"></i></li></a>
                        <a href="https://twitter.com/theritiktiwari" target="_blank" rel="noreferrer"><li><i className="fab fa-twitter"></i></li></a>
                        <a href="https://facebook.com/theritiktiwari" target="_blank" rel="noreferrer"><li><i className="fab fa-facebook-square"></i></li></a>
                        <a href="mailto:theritiktiwari@gmail.com" target="_blank" rel="noreferrer"><li><i className="fas fa-envelope"></i></li></a>
                    </ul>
                </div>
                <div className="copyright">
                    <p>&copy; 2021-{year} By <a className="name" href="/">Ritik Tiwari</a>. All Rights Reserved.</p>
                </div>
            </div>

        </footer>
    )
}

export default Footer
