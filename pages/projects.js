import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import ModalCard from '../Components/ModalCard';
import Loader from '../Components/Loader';

const Project = ({ name, client, router, imgURL }) => {
    const [projectData, setProjectData] = useState();
    useEffect(() => {
        const getData = async () => {
            const data = await client.fetch(`*[_type == "projects"] | order(publishedAt desc)`);
            setProjectData(data);
        }
        getData();
    }, [router]);

    const time = (startingMonth, startingYear) => {
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        month++;

        let y = year - startingYear;
        let m = month + (12 * y) - startingMonth;
        y = 0;
        m++;

        while (m >= 12) {
            m -= 12;
            y++;
        }

        return (y ? y + (y === 1 ? ' yr ' : ' yrs ') : '') + (m ? m + (m === 1 ? ' mo' : ' mos') : '');
    }
    return (
        <>
            <Head>
                <title>Projects | {name}</title>
            </Head>
            <section className="projects-container project-page">

                {projectData ? projectData.map((val, index) => {
                        return <ModalCard
                            imgURL={imgURL}
                            project={true}
                            key={index}
                            img={val.image}
                            title={val.title}
                            description={val.description}
                            starting={val.starting}
                            ending={val.ending}
                            time={val.ending === " - Present" ? time(val.time.split(",")[0], val.time.split(",")[1]) : val.time}
                            link={val.link}
                        />
                    }) : <Loader />}
            </section>
        </>
    )
}

export default Project
