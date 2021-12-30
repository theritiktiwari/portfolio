import React from 'react';

import ProjectData from './Data/ProjectData';
import ModalCard from './ModalCard';

const Project = () => {

    document.title = 'Projects | Ritik Tiwari';

    return (
        <section className="projects-container project-page">
            {
                ProjectData.map((val, index) => {
                    return <ModalCard
                        project={true}
                        key={index}
                        img={val.img}
                        title={val.title}
                        description={val.description}
                        starting={val.starting}
                        ending={val.ending}
                        time={val.time}
                        link={val.link}
                    />
                })
            }
        </section>
    )
}

export default Project
