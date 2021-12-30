import React from 'react'

import ModalCard from './ModalCard';
import ECAData from './Data/ECAData';

const ECA = () => {

    document.title = "Extra Curricular | Ritik Tiwari";

    return (
        <section className='info-container'>
            {
                ECAData.map((val, index) => {
                    return <ModalCard
                        key={index}
                        info={true}
                        img={val.img}
                        date={val.date}
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
