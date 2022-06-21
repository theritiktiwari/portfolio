import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { query, collection, getDocs, orderBy, limit } from "firebase/firestore";

const Projects = () => {
    const [projectData, setProjectData] = useState();
    useEffect(() => {
        const getData = async () => {
            const querySnapshot = await getDocs(query(collection(db, "project"), orderBy("timestamp", "desc"), limit(3)));
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

    const handledate = (date) => {
        const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dateObj = new Date(date);
        return `${month[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    }

    const b_radius = {
        borderRadius: '10px'
    }

    return (
        <section className="projects">
            <h1>My Projects</h1>
            <div className="projects-container">

                {projectData && projectData.map((val, index) => {
                    return <div key={index} className="myProject" data-aos="zoom-in" style={b_radius}>
                        <div className="left">
                            <img src={val.img} alt={val.title} />
                        </div>
                        <div className="right">
                            <h2>{val.title}</h2>
                            <div className="duration">{handledate(val.timestamp.toDate())}</div>
                            <a className="btn read" href={val.link} target="_blank" rel="noreferrer">Check Now</a>
                        </div>
                    </div>
                })}

            </div>
        </section>
    )
}

export default Projects
