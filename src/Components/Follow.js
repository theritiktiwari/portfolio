import React from 'react'

const Follow = () => {
    return (
        <section className="follow">
            <h1>Stay Connect With Me</h1>
            <div className="container">
                <a className="box" href="https://linkedin.com/in/theritiktiwari" target="_blank" rel="noreferrer">
                    <div className="logo"><i className="fab fa-linkedin-in"></i></div>
                    <div className="text">
                        <h3>LinkedIn</h3>
                        <p>600+ Followers</p>
                    </div>
                </a>

                <a className="box" href="https://github.com/theritiktiwari" target="_blank" rel="noreferrer">
                    <div className="logo"><i className="fab fa-github"></i></div>
                    <div className="text">
                        <h3>GitHub</h3>
                        <p>10+ Followers</p>
                    </div>
                </a>

                <a className="box" href="https://instagram.com/codingwalls" target="_blank" rel="noreferrer">
                    <div className="logo"><i className="fab fa-instagram"></i></div>
                    <div className="text">
                        <h3>Instagram</h3>
                        <p>1k+ Followers</p>
                    </div>
                </a>

                <a className="box" href="https://www.youtube.com/channel/UCaTiS60yVc1MJods9sFFtuw?sub_confirmation=1" target="_blank" rel="noreferrer">
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
