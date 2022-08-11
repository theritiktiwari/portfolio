import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PortableText from "react-portable-text"

const dummyImage = "https://i.ibb.co/yWZR9j0/Avatar.png";

const Experience = ({ name, client, router, imgURL }) => {
    const [experienceData, setExperienceData] = useState();

    useEffect(() => {
        const getData = async () => {
            const data = await client.fetch(`*[_type == "experience"] | order(publishedAt desc)`);
            setExperienceData(data);
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
                <title>Experience | {name}</title>
            </Head>
            <section className="details-container" style={{ textAlign: 'justify' }}>
                <div className="center-line exp-center"></div>

                {experienceData && experienceData.map((val, index) => {
                    return <div key={index} className={`row row-${index % 2 == 0 ? `1` : `2`}`}>
                        <div className="box" data-aos={`fade-${index % 2 == 0 ? `right` : `left`}`}>
                            <i className='icon exp-icon'><img src={val.image ? imgURL(val.image).url() : dummyImage} alt={val.organisation} loading='lazy' /></i>
                            <div className="main">
                                <div className="title">{val.title}</div>
                                <b>{val.organisation}</b>
                            </div>
                            <p className='date'>{val.starting} - {val.ending} • {val.ending === "Present" ? time(val.time.split(",")[0], val.time.split(",")[1]) : val.time}</p>
                            {val.detail && <ul className='detail'>
                                <PortableText className="text"
                                    content={val.detail}
                                    serializers={{
                                        h1: props => <h1 style={{ color: "red" }} {...props} />,
                                        li: ({ children }) => <li className="special-list-item">{children}</li>,
                                    }}
                                />
                            </ul>}
                            <div className="bottom">
                                <a href={val.link} target="_blank" rel="noreferrer" className='info btn'>More Info</a>
                                {val.link && <a href={val.link} target={"_blank"} rel="noreferrer" className='cert btn'>Certificate</a>}
                            </div>
                        </div>
                    </div>
                })}
            </section>
        </>
    )
}

export default Experience
