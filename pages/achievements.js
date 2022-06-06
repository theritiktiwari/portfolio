import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { db } from '../Components/firebase';
import { collection, getDocs } from "firebase/firestore";

import ModalCard from '../Components/ModalCard';
import Mode from '../Components/Mode';

const Achievements = (props) => {
    const [achievementData, setAchievementData] = useState();
    useEffect(() => {
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "achievement"));
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setAchievementData(data);
        }
        getData();
    }, []);

    return (
        <>
            <Head>
                <title>Achievements | {props.name}</title>
            </Head>
            <Mode work={true} name={props.name} />
            <section className='info-container'>
                {
                    achievementData && achievementData.map((val, index) => {
                        return <ModalCard
                            key={index}
                            info={true}
                            img={val.img}
                            date={val.date}
                            title={val.title}
                            position={val.position}
                            link={val.link}
                            description={val.description}
                        />
                    })
                }
            </section>
        </>
    )
}

export default Achievements
