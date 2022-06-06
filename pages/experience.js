import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { db } from '../Components/firebase';
import { collection, getDocs } from "firebase/firestore";

const Experience = (props) => {
    const [experienceData, setExperienceData] = useState();

    useEffect(() => {
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "experience"));
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setExperienceData(data);
        }
        getData();
    }, []);

    const detail = (data) => {
        let det = data.split("/n");
        det.forEach((val, index) => {
            det[index] = val.split("/b");
        })
        return det;
    }

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
                <title>Experience | {props.name}</title>
            </Head>
            <section className="details-container" style={{ textAlign: 'justify' }}>
                <div className="center-line exp-center"></div>

                {experienceData && experienceData.map((val, index) => {
                    return <div key={index} className={`row row-${index % 2 == 0 ? `1` : `2`}`}>
                        <div className="box" data-aos={`fade-${index % 2 == 0 ? `right` : `left`}`}>
                            <i className='icon exp-icon'><img src={val.img} alt={val.organisation} loading='lazy' /></i>
                            <div className="main">
                                <div className="title">{val.title}</div>
                                <b>{val.organisation}</b>
                            </div>
                            <p className='date'>{val.starting} - {val.ending} • {val.ending === "Present" ? time(val.time.split(",")[0], val.time.split(",")[1]) : val.time}</p>
                            <ul className='detail'>
                                {detail(val.detail).map((v, i) => {
                                    return <li key={i}>{v && v.map((b, ind) => {
                                        return <sapn key={ind}>{b}<br /></sapn>
                                    })}</li>
                                })}
                            </ul>
                            <div className="bottom">
                                <a href={val.link} target="_blank" rel="noreferrer" className='info btn'>More Info</a>
                                {val.certificate && <a href={val.certificate} target={"_blank"} rel="noreferrer" className='cert btn'>Certificate</a>}
                            </div>
                        </div>
                    </div>
                })}
            </section>
        </>
    )
}

export default Experience
