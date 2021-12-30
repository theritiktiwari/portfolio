import React from 'react';

const Projects = () => {

    const VITCRMS = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/projects%2FVITCRMS.png?alt=media&token=e610b4d8-2ed2-461a-bace-8d3e43852501';
    const DORMIO = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/projects%2FDORMIO.png?alt=media&token=7ac3d605-4949-4d99-85fc-d28417c15a50';
    const DeFRAUDER = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/projects%2FDeFRAUDER.png?alt=media&token=28219448-f1bb-4373-9ac3-fc2da9439dc9';

    const b_radius = {
        borderRadius: '10px'
    }
    return (
        <section className="projects">
            <h1>My Projects</h1>
            <div className="projects-container">
                <div className="myProject" data-aos="flip-left" style={b_radius}>
                    <div className="left">
                        <img src={VITCRMS} alt="VIT CRMS Project" />
                    </div>
                    <div className="right">
                        <h2>VIT-CRMS</h2>
                        <div className="duration">March 02, 2021</div>
                        <a className="btn read" href="https://github.com/theritiktiwari/VIT-CRMS" target="_blank" rel="noreferrer">Read More</a>
                    </div>
                </div>

                <div className="myProject" data-aos="zoom-in" style={b_radius}>
                    <div className="left">
                        <img src={DORMIO} alt="DORMIO Project" />
                    </div>
                    <div className="right">
                        <h2>DORMIO</h2>
                        <div className="duration">October 10, 2021</div>
                        <a className="btn read" href="https://github.com/theritiktiwari/DORMIO" target="_blank" rel="noreferrer">Read More</a>
                    </div>
                </div>

                <div className="myProject" data-aos="flip-right" style={b_radius}>
                    <div className="left">
                        <img src={DeFRAUDER} alt="DeFrauder Project" />
                    </div>
                    <div className="right">
                        <h2>DeFrauder</h2>
                        <div className="duration">November 13, 2021</div>
                        <a className="btn read" href="https://github.com/theritiktiwari/DeFrauder" target="_blank" rel="noreferrer">Read More</a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Projects
