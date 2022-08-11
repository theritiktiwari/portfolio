import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const SkillSet = ({ name, client, router, imgURL }) => {
    const [skillData, setSkillData] = useState();
    useEffect(() => {
        const getData = async () => {
            const data = await client.fetch(`*[_type == "skills"]`);
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
                {skillData && Object.keys(skillData).map((domain, index) => {
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
                })}
            </section>
        </>
    )
}

export default SkillSet
