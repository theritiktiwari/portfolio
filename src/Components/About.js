import React from 'react'

const About = (props) => {
    return (
        <section className="about">
            <div className="container">
                <div className="left">
                    <h1>About Me</h1>
                </div>
                <div className="right">
                    <p className="main-text">
                        My name is Ritik Tiwari. I am a full-stack developer with a passion for Blockchain Development. I have a good technical backgroundand a bachelor's degree in engineering.
                    </p>
                    <p className="text">
                        Since September 2020, I have been pursuing a profession in B.Tech Computer Science. <br />
                        I utilise social media to help young hustlers realise their true potential so they can help us win. I enjoy spending my free time studying new things while I am not working.
                    </p>
                    <a className="btn education" href="/education">Education</a>
                    <a className="btn resume" href={props.resume}>View Resume</a>
                </div>
            </div>
        </section>
    )
}

export default About
