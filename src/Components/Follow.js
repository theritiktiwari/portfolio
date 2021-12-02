import React from 'react'

const Follow = () => {
    return (
        <section className="follow">
            <h1>Stay Connect With Me</h1>
            <div className="container">
                <a className="box" href="/">
                    <div className="logo"><i className="fab fa-linkedin-in"></i></div>
                    <div className="text">
                        <h3>LinkedIn</h3>
                        <p>500+ Followers</p>
                    </div>
                </a>

                <a className="box" href="/">
                    <div className="logo"><i className="fab fa-github"></i></div>
                    <div className="text">
                        <h3>GitHub</h3>
                        <p>10+ Followers</p>
                    </div>
                </a>

                <a className="box" href="/">
                    <div className="logo"><i className="fab fa-instagram"></i></div>
                    <div className="text">
                        <h3>Instagram</h3>
                        <p>1k+ Followers</p>
                    </div>
                </a>

                <a className="box" href="/">
                    <div className="logo"><i className="fab fa-youtube"></i></div>
                    <div className="text">
                        <h3>YouTube</h3>
                        <p>50+ Subscribers</p>
                    </div>
                </a>
            </div>
        </section>
    )
}

export default Follow
