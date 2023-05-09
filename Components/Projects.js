import React, { useState, useEffect } from 'react';
import Loader from './Loader';

const Projects = ({ client, router, imgURL }) => {
    const [projectData, setProjectData] = useState();
    useEffect(() => {
        const getData = async () => {
            const data = await client.fetch(`*[_type == "projects"] | order(publishedAt desc) [0...3]`);
            setProjectData(data);
        }
        getData();
    }, [router]);

    const handledate = (date) => {
        const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dateObj = new Date(date);
        const day = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate();
        return `${month[dateObj.getMonth()]} ${day}, ${dateObj.getFullYear()}`;
    }

    const b_radius = {
        borderRadius: '10px'
    }

    return (
        <section className="projects">
            <h1>My Projects</h1>
            <div className="projects-container">

                {projectData ? projectData.map((val, index) => {
                    return <div key={index} className="myProject" data-aos="zoom-in" style={b_radius}>
                        <div className="left">
                            <img src={imgURL(val.image).url()} alt={val.title} />
                        </div>
                        <div className="right">
                            <h2>{val.title}</h2>
                            <div className="duration">{handledate(val.publishedAt)}</div>
                            <a className="btn read" href={val.link} target="_blank" rel="noreferrer">Check Now</a>
                        </div>
                    </div>
                }) : <Loader />}

            </div>
        </section>
    )
}

export default Projects
