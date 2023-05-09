import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Loader from '../Components/Loader';

const SkillSet = ({ name, client, router, imgURL }) => {
    const [skillData, setSkillData] = useState();
    useEffect(() => {
        const getData = async () => {
            const data = await client.fetch(`*[_type == "skills"]`);
            // sort by domain, first Language, then Frameworks, then tools and then others
            data.sort((a, b) => {
                if (a.domain === 'Languages') {
                    return -1;
                } else if (b.domain === 'Languages') {
                    return 1;
                } else if (a.domain === 'Frameworks') {
                    return -1;
                } else if (b.domain === 'Frameworks') {
                    return 1;
                } else if (a.domain === 'Tools & Technologies') {
                    return -1;
                } else if (b.domain === 'Tools & Technologies') {
                    return 1;
                } else {
                    return 0;
                }
            });
            const skills = {};
            data.forEach(skill => {
                if (!skills[skill.domain]) {
                    skills[skill.domain] = [];
                }
                skills[skill.domain].push(skill);
            });
            setSkillData(skills);
        }
        getData();
    }, [router]);

    return (
        <>
            <Head>
                <title>Skills | {name}</title>
            </Head>
            <section className='skill-set'>
                {skillData ? Object.keys(skillData).map((domain, index) => {
                    return (
                        <div key={index} className='cont'>
                            <h2 className='title'>{domain}</h2>
                            <div className='skill-type'>
                                {skillData[domain].map(skill => {
                                    return (
                                        <div key={skill._id} className='skill-box'>
                                            <img className="icon" src={imgURL(skill.image).url()} alt={skill.skill} />
                                            <p>{skill.skill}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                }) : <Loader />}
            </section>
        </>
    )
}

export default SkillSet
