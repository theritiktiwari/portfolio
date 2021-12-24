import React from 'react'
import { Link } from 'react-router-dom';

const About = (props) => {
    return (
        <section className="about">
            <div className="container"  data-aos="fade-up">
                <div className="left">
                    <h1>About Me</h1>
                </div>
                <div className="right">
                    <p className="main-text">
                        My name is Ritik Tiwari. I am a fullstack developer with a passion for Blockchain Development. I have a good technical backgroundand a bachelor's degree in engineering.
                    </p>
                    <p className="text">
                        Since September 2020, I have been pursuing a profession in B.Tech Computer Science.
                        I utilise social media to help young hustlers realise their true potential so they can help us win. I enjoy spending my free time studying new things while I am not working.
                    </p>
                    <Link className="btn resume" to={props.resume} target="_blank" rel="noreferrer">View Resume</Link>
                    <Link className="btn education" to="/education">Education</Link>
                </div>
            </div>
        </section>
    )
}

export default About
