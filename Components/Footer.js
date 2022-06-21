import React from 'react'
import Link from 'next/link';

const Footer = (props) => {
    const copyright = (year) => {
        const currentYear = new Date().getFullYear();
        return (year === currentYear) ? year : `${year}-${currentYear % 100}`;
    }
    return (
        <>
            {props.count ?
                <footer className="footer">
                    <div className="container">
                        <div className="count-visitor">
                            <p className="visitor">TOTAL VISITORS : {props.count || "1.5k+"}</p>
                        </div>

                        <div className="copyright">
                            <p>&copy; {copyright(2020)} By <Link href="/"><a className="name">{props.name}</a></Link>. All Rights Reserved.</p>
                        </div>
                    </div>

                </footer> : null}
        </>
    )
}

export default Footer
