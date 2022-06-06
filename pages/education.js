import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { db } from '../Components/firebase';
import { collection, getDocs } from "firebase/firestore";

const Education = (props) => {
    const [educationData, setEducationData] = useState();

    useEffect(() => {
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "education"));
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setEducationData(data);
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
    const KV = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/education%2FKV.png?alt=media&token=5ca826d6-e1bd-4ecf-8f3c-415e5c67d5bd';
    const VIT = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/education%2FVIT.png?alt=media&token=2afb2a59-dd4e-4bca-af41-1e41e9cd6642';
    return (
        <>
            <Head>
                <title>Education | {props.name}</title>
            </Head>
            <section className="details-container">
                <div className="center-line"></div>
                {educationData && educationData.map((val, index) => {
                    return <div key={index} className={`row row-${index % 2 == 0 ? `1` : `2`}`}>
                        <div className="box" data-aos={`fade-${index % 2 == 0 ? `right` : `left`}`}>
                            <i className={`icon edu-icon fas ${(val.title == "High School") ? "fa-school" : ((val.title == "Intermediate") ? "fa-university" : "fa-graduation-cap")}`}></i>
                            <div className="head">
                                <div className="title">{val.title}</div>
                                <img src={val.img} alt={val.title} className='edu-img' />
                                <b>{val.organisation}</b>
                            </div>
                            <p className='details'>{val.details}</p>
                            <div className="bottom"><b>{val.grade}</b></div>
                            <div className="bottom">{val.year}</div>
                        </div>
                    </div>
                })}
            </section>
        </>
    )
}

export default Education
