import React from 'react'

import OtherCard from './OtherCard';
import AchievementData from './Data/AchievementData';

const Achievements = () => {

    document.title = "Achievements | Ritik Tiwari";

    return (
        <section className='info-container'>
            {
                AchievementData.map((val, index) => {
                    return <OtherCard
                        key={index}
                        img={val.img}
                        time={val.time}
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
