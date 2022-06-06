import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { db } from '../Components/firebase';
import { collection, getDocs } from "firebase/firestore";

import ModalCard from '../Components/ModalCard';

const Project = (props) => {
    const [projectData, setProjectData] = useState();
    useEffect(() => {
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "project"));
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setProjectData(data);
        }
        getData();
    }, []);

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
                <title>Projects | {props.name}</title>
            </Head>
            <section className="projects-container project-page">

                {
                    projectData && projectData.map((val, index) => {
                        return <ModalCard
                            project={true}
                            key={index}
                            img={val.img}
                            title={val.title}
                            description={val.description}
                            starting={val.starting}
                            ending={val.ending}
                            time={val.ending === " - Present" ? time(val.time.split(",")[0], val.time.split(",")[1]) : val.time}
                            link={val.link}
                        />
                    })
                }
            </section>
        </>
    )
}

export default Project
