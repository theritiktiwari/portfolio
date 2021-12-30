import React from 'react'

import OtherCard from './OtherCard';
import ECAData from './Data/ECAData';

const ECA = () => {

    document.title = "Extra Curricular | Ritik Tiwari";

    return (
        <section className='info-container'>
            {
                ECAData.map((val, index) => {
                    return <OtherCard
                        key={index}
                        img={val.img}
                        time={val.time}
                        title={val.title}
                        link={val.link}
                        description={val.description}
                    />
                })
            }
        </section>
    )
}

export default ECA
