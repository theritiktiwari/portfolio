import React from 'react';
import Loader from './Loader';

const Follow = ({ data }) => {
    return (
        <section className="follow">
            <h1>Stay Connected</h1>
            {data ? <div className="container">
                <a className="box" href="https://linkedin.com/in/theritiktiwari" target="_blank" rel="noreferrer">
                    <div className="logo"><i className="fab fa-linkedin-in"></i></div>
                    <div className="text">
                        <h3>LinkedIn</h3>
                        <p>{data.linkedin}+ Followers</p>
                    </div>
                </a>

                <a className="box" href="https://github.com/theritiktiwari" target="_blank" rel="noreferrer">
                    <div className="logo"><i className="fab fa-github"></i></div>
                    <div className="text">
                        <h3>GitHub</h3>
                        <p>{data.github}+ Followers</p>
                    </div>
                </a>

                <a className="box" href="https://instagram.com/codingwalls" target="_blank" rel="noreferrer">
                    <div className="logo"><i className="fab fa-instagram"></i></div>
                    <div className="text">
                        <h3>Instagram</h3>
                        <p>{data.instagram}+ Followers</p>
                    </div>
                </a>

                <a className="box" href="https://www.youtube.com/channel/UCaTiS60yVc1MJods9sFFtuw?sub_confirmation=1" target="_blank" rel="noreferrer">
                    <div className="logo"><i className="fab fa-youtube"></i></div>
                    <div className="text">
                        <h3>YouTube</h3>
                        <p>{data.youtube}+ Subscribers</p>
                    </div>
                </a>
            </div> : <Loader />}
        </section>
    )
}

export default Follow
