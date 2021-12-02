import React from 'react';
import DeFRAUDER from '../Files/Images/DeFRAUDER.png';

const Projects = () => {
    return (
        <section className="projects">
            <h1>My Projects</h1>
            <div className="projects-container">
                <div className="project-card">
                    <div className="project-badge">
                        <p>March 02, 2021</p>
                    </div>
                    <div className="project-card-image">
                        <img src="http://vitcrms.tk/images/logo.png" alt="VITCRMS project" />
                    </div>
                    <div className="project-card-info">
                        <h2>VITCRMS</h2>
                        <p>A website to provide the resources related to college.</p>
                        <div className="project-card-info-links">
                            <a className="btn read" href="https://github.com/theritiktiwari/VIT-CRMS" target="_blank" rel="noreferrer">Read More</a>
                        </div>
                    </div>
                </div>

                <div className="project-card">
                    <div className="project-badge">
                        <p>Oct 10, 2021</p>
                    </div>
                    <div className="project-card-image">
                        <img src="https://dormiostore.firebaseapp.com/static/media/logo.d93f0beb.png" alt="DORMIO project" />
                    </div>
                    <div className="project-card-info">
                        <h2>DORMIO</h2>
                        <p>A device that helps to avoid mobile phones during the mattress time.</p>
                        <div className="project-card-info-links">
                            <a className="btn read" href="https://github.com/theritiktiwari/DORMIO" target="_blank" rel="noreferrer">Read More</a>
                        </div>
                    </div>
                </div>

                <div className="project-card">
                    <div className="project-badge">
                        <p>Nov 13, 2021</p>
                    </div>
                    <div className="project-card-image">
                        <img src={DeFRAUDER} alt="DeFrauder Project" />
                    </div>
                    <div className="project-card-info">
                        <h2>DeFRAUDER</h2>
                        <p>This is a portal for VITFAM, which is hosting an event about financial fraud.</p>
                        <div className="project-card-info-links">
                            <a className="btn read" href="https://github.com/theritiktiwari/DeFrauder" target="_blank" rel="noreferrer">Read More</a>
                        </div>
                    </div>
                </div>

            </div>

        </section>
    )
}

export default Projects
