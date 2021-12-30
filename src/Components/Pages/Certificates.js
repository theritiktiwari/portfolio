import React from 'react'

import ModalCard from './ModalCard';
import CertificateData from './Data/CertificateData';

const Certificates = () => {

    document.title = "Certificates | Ritik Tiwari";

    return (
        <section className='info-container'>
            {
                CertificateData.map((val, index) => {
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

export default Certificates
