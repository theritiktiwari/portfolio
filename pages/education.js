import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const Education = ({ name, client, router, imgURL }) => {
    const [educationData, setEducationData] = useState();

    useEffect(() => {
        const getData = async () => {
            const data = await client.fetch(`*[_type == "education"] | order(_createdAt desc)`);
            setEducationData(data);
        }
        getData();
    }, [router]);

    return (
        <>
            <Head>
                <title>Education | {name}</title>
            </Head>
            <section className="details-container">
                <div className="center-line"></div>
                {educationData && educationData.map((val, index) => {
                    return <div key={index} className={`row row-${index % 2 == 0 ? `1` : `2`}`}>
                        <div className="box" data-aos={`fade-${index % 2 == 0 ? `right` : `left`}`}>
                            <i className={`icon edu-icon fas ${(val.title == "High School") ? "fa-school" : ((val.title == "Intermediate") ? "fa-university" : "fa-graduation-cap")}`}></i>
                            <div className="head">
                                <div className="title">{val.title}</div>
                                {val.image && <img src={imgURL(val.image).url()} alt={val.title} className='edu-img' />}
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
