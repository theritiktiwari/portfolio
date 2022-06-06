import React from 'react'
import Link from 'next/link';

const Footer = (props) => {

    let year = new Date().getFullYear();
    year %= 100;

    return (
        <footer className="footer">
            <div className="container">
                <div className="count-visitor">
                    <p className="visitor">TOTAL VISITORS : {props.count ? props.count : "1.5k+"}</p>
                </div>
                
                <div className="copyright">
                    <p>&copy; 2021-{year} By <Link href="/"><a className="name">{props.name}</a></Link>. All Rights Reserved.</p>
                </div>
            </div>

        </footer>
    )
}

export default Footer
