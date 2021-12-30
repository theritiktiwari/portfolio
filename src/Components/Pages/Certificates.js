import React from 'react'

import OtherCard from './OtherCard';
import CertificateData from './Data/CertificateData';

const Certificates = () => {

    document.title = "Certificates | Ritik Tiwari";

    return (
        <section className='info-container'>
            {
                CertificateData.map((val, index) => {
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

export default Certificates
