import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import ModalCard from '../Components/ModalCard';

const Certificates = ({ name, client, router, imgURL }) => {
    const [certificateData, setCertificateData] = useState();
    useEffect(() => {
        const getData = async () => {
            const data = await client.fetch(`*[_type == "certificates"] | order(date desc)`);
            setCertificateData(data);
        }
        getData();
    }, [router]);

    return (
        <>
            <Head>
                <title>Certificates | {name}</title>
            </Head>
            <section className='info-container'>
                {
                    certificateData && certificateData.map((val, index) => {
                        return <ModalCard
                            key={index}
                            imgURL={imgURL}
                            info={true}
                            img={val.image}
                            date={val.date}
                            title={val.title}
                            link={val.link}
                            description={val.description}
                        />
                    })
                }
            </section>
        </>
    )
}

export default Certificates
