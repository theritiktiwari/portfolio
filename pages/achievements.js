import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ModalCard from '../Components/ModalCard';
import Loader from '../Components/Loader';

const Achievements = ({ name, client, router, imgURL }) => {
    const [achievementData, setAchievementData] = useState();
    useEffect(() => {
        const getData = async () => {
            const data = await client.fetch(`*[_type == "achievements"]`);
            data.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            setAchievementData(data);
        }
        getData();
    }, [router]);

    return (
        <>
            <Head>
                <title>Achievements | {name}</title>
            </Head>
            <section className='info-container'>
                {achievementData ? achievementData.map((val, index) => {
                    return <ModalCard
                        imgURL={imgURL}
                        key={index}
                        info={true}
                        img={val.image}
                        date={val.date}
                        title={val.title}
                        position={val.position}
                        link={val.link}
                        description={val.description}
                    />
                }) : <Loader />}
            </section>
        </>
    )
}

export default Achievements
