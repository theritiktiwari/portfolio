import React from 'react';
import DeFRAUDER from '../Files/Images/DeFRAUDER.png';
import VITCRMS from '../Files/Images/VITCRMS.png';

const Projects = () => {
    return (
        <section className="projects">
            <h1>My Projects</h1>
            <div className="projects-container">
                <div className="myProject">
                    <div className="left">
                        <img src={VITCRMS} alt="VIT CRMS Project" />
                    </div>
                    <div className="right">
                        <h2>VIT-CRMS</h2>
                        <div className="duration">March 02, 2021</div>
                        <p><strong>A website to provide the resources related to college.</strong> It facilitates easy access of study material, lab reports and books for different courses, offered at the University, by the students. The platform enables students to access the course material provided by a specific faculty for a particular course.</p>
                        <a className="btn read" href="https://github.com/theritiktiwari/VIT-CRMS" target="_blank" rel="noreferrer">Read More</a>
                    </div>
                </div>

                <div className="myProject">
                    <div className="left">
                        <img src="https://dormiostore.firebaseapp.com/static/media/logo.d93f0beb.png" alt="DORMIO Project" />
                    </div>
                    <div className="right">
                        <h2>DORMIO</h2>
                        <div className="duration">October 10, 2021</div>
                        <p>Now a days, Digital Gadgets are so much alluring and attractive that people are ready to compromise with their health for using them all day even during bed time. This habit creates a lot of health issues and results in inability to perform to their maximum in their day time. This is <strong>a device that helps to avoid mobile phones during the mattress time.</strong></p>
                        <a className="btn read" href="https://github.com/theritiktiwari/DORMIO" target="_blank" rel="noreferrer">Read More</a>
                    </div>
                </div>

                <div className="myProject">
                    <div className="left">
                        <img src={DeFRAUDER} alt="DeFrauder Project" />
                    </div>
                    <div className="right">
                        <h2>DeFrauder</h2>
                        <div className="duration">November 13, 2021</div>
                        <p><strong>This is a portal for VITFAM, which is hosting an event about financial fraud.</strong> Where a player has provided a summary of the story and clues, they must next go through the clues that will be placed in various platforms on the internet. They must locate the clue and create a story based on the clue, and then, in order to pass the stage.</p>
                        <a className="btn read" href="https://github.com/theritiktiwari/DeFrauder" target="_blank" rel="noreferrer">Read More</a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Projects
