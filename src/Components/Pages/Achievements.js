import React from 'react'

import ModalCard from './ModalCard';
import AchievementData from './Data/AchievementData';

const Achievements = () => {

    document.title = "Achievements | Ritik Tiwari";

    return (
        <section className='info-container'>
            {
                AchievementData.map((val, index) => {
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
    )
}

export default Achievements
